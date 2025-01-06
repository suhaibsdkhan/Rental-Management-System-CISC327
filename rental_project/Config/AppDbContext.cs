using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using rental_project.Models;

namespace rental_project.Config;

public class AppDbContext : IdentityDbContext<User> {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {
        
    }

    public DbSet<LeaseAgreement> LeaseAgreements { get; set; }
    public DbSet<Tenant> Tenants { get; set; }

    public DbSet<RentPayment> RentPayments { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder) {
        base.OnModelCreating(builder);
    }
}