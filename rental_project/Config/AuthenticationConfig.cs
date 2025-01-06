using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using rental_project.Models;

namespace rental_project.Config;

public static class AuthenticationConfig {
    public static void AddAuthServices(WebApplicationBuilder builder) {
        var databaseSettings = builder.Configuration.GetSection("DatabaseSettings").Get<DatabaseSettings>();
        builder.Services.AddDbContext<AppDbContext>(x =>
            x.UseNpgsql(databaseSettings.ConnectionString));
        
        builder.Services.AddIdentityApiEndpoints<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>();
    }
}

public class DatabaseSettings {
    public string ConnectionString { get; set; }
}