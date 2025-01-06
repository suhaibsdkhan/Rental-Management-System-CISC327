using Microsoft.AspNetCore.Identity;

namespace rental_project.Models;

public class User : IdentityUser {
    public DateTime CreatedOn { get; init; } = DateTime.UtcNow;
}