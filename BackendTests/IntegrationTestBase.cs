using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using rental_project.Config;
using rental_project.Models;
using rental_project.Services;

public abstract class IntegrationTestBase : IClassFixture<WebApplicationFactory<Program>>
{
    protected readonly HttpClient Client;
    protected readonly WebApplicationFactory<Program> Factory;
    public const string TestUserEmail = "test@example.com";
    protected const string TestUserPassword = "Test123!@#";
    protected string TestUserId;

    protected IntegrationTestBase(WebApplicationFactory<Program> factory)
    {
        Factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.AddScoped<ILeaseService, LeaseService>();

                services.RemoveAll(typeof(DbContextOptions<AppDbContext>));
                services.AddDbContext<AppDbContext>(options =>
                    options.UseInMemoryDatabase("TestDatabase"));

                // auth scheme
                services.AddAuthentication("Test")
                    .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                        "Test", options => { });
            });

            builder.UseEnvironment("Testing");
        });

        Client = Factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        // init db and create test user
        using (var scope = Factory.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            dbContext.Database.EnsureCreated();

            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var user = new User
            {
                UserName = TestUserEmail,
                Email = TestUserEmail,
                EmailConfirmed = true
            };

            if (userManager.FindByEmailAsync(TestUserEmail).Result == null)
            {
                var result = userManager.CreateAsync(user, TestUserPassword).Result;
                if (!result.Succeeded)
                {
                    throw new Exception($"Could not create test user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }

            user = userManager.FindByEmailAsync(TestUserEmail).Result;
            TestUserId = user.Id;
        }
    }

    protected async Task AuthenticateTestUser()
    {
        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Test");
    }
}

// auth handler for testing
public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly IServiceProvider _serviceProvider;

    public TestAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        IServiceProvider serviceProvider)
        : base(options, logger, encoder, clock)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var user = await userManager.FindByEmailAsync(IntegrationTestBase.TestUserEmail);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
        };

        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "Test");

        return AuthenticateResult.Success(ticket);
    }
}