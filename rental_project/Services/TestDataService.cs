using rental_project.Config;
using rental_project.Models;

namespace rental_project.Services; 

public class TestDataService : ITestDataService {
    private readonly AppDbContext _context;
    private static int _paymentIdCounter = 0;

    public TestDataService(AppDbContext context) {
        _context = context;
    }

    public void GenerateTestData(string landlordId) {
        var leaseAgreement = new LeaseAgreement {
            Id = Guid.NewGuid(),
            LandlordId = Guid.Parse(landlordId),
            Address = "50 Brock",
            SignedAt = DateTime.UtcNow.AddDays(-30),
            LeaseStart = DateTime.UtcNow.AddDays(-10),
            LeaseEnd = DateTime.UtcNow.AddYears(1),
            RentAmount = new Random().Next(500, 3000),
            Tenants = new List<Tenant> {
                new Tenant {
                    Id = Guid.NewGuid(),
                    FirstName = "John",
                    LastName = "Doe"
                },
                new Tenant {
                    Id = Guid.NewGuid(),
                    FirstName = "Jane",
                    LastName = "Smith"
                }
            }
        };

        _context.LeaseAgreements.Add(leaseAgreement);

        var rentPayments = new List<RentPayment>();
        for (int month = 1; month <= 12; month++)
        {
            rentPayments.Add(new RentPayment
            {
                Id = new Guid(_paymentIdCounter++.ToString("D32")),
                LeaseAgreement = leaseAgreement,
                PaymentDeadline = leaseAgreement.LeaseStart.AddMonths(month)
            });
        }

        _context.RentPayments.AddRange(rentPayments);
        _context.SaveChanges();
    }
}

public interface ITestDataService {
    void GenerateTestData(string landlordId);
}