using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using rental_project.Config;
using rental_project.Controllers;
using rental_project.Models;

var builder = WebApplication.CreateBuilder(args);
builder.AddServices();
builder.Services.AddRazorPages();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("DatabaseSettings"));

AuthenticationConfig.AddAuthServices(builder);

builder.WebHost.UseStaticWebAssets();
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

Routes.ConfigureRoutes(app);

app.MapRazorPages(); // Map Razor Pages// html support
app.UseDefaultFiles(); // To use index.html as default page
app.UseStaticFiles(); // To serve static files

app.MapIdentityApi<User>();

if (app.Environment.IsProduction() || app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        dbContext.Database.Migrate();
    }
}

using (var scope = app.Services.CreateScope()) {
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

    string email = "admin@admin.com";
    string password = "Test1234!";

    if (await userManager.FindByEmailAsync(email) == null) {
        var user = new User {
            CreatedOn = DateTime.UtcNow,
            UserName = email,
            Email = email,
        };
        await userManager.CreateAsync(user, password);
    }
}

app.Run();

public partial class Program { }