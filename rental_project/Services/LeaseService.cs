using Microsoft.EntityFrameworkCore;
using rental_project.Config;
using rental_project.Models;

namespace rental_project.Services;

public class LeaseService : ILeaseService {
    private readonly AppDbContext _context;

    public LeaseService(AppDbContext context) {
        _context = context;
    }

    public LeaseAgreement? GetLeaseById(string id) {
        return _context.LeaseAgreements.Include(la => la.Tenants)
            .FirstOrDefault(la => la.Id.ToString() == id);
    }

    public LeaseAgreement CreateLease(CreateLeaseDTO lease, string landlordId) {
        var la = new LeaseAgreement {
            Id = Guid.NewGuid(),
            LandlordId = Guid.Parse(landlordId),
            Address = lease.Address,
            SignedAt = DateTime.UtcNow,
            LeaseStart = lease.LeaseStart,
            LeaseEnd = lease.LeaseEnd,
            RentAmount = lease.RentAmount,
            Tenants = lease.Tenants.Select(t => new Tenant {
                Id = Guid.NewGuid(),
                FirstName = t.FirstName,
                LastName = t.LastName
            }).ToList()
        };
        _context.LeaseAgreements.Add(la);
        _context.SaveChanges();
        return la;
    }

    public void DeleteLease(string leaseId) {
        var la = _context.LeaseAgreements.Include(la => la.Tenants)
            .FirstOrDefault(la => la.Id.ToString() == leaseId);

        if (la is not null) {
            _context.Tenants.RemoveRange(la.Tenants);
            _context.LeaseAgreements.Remove(la);
            _context.SaveChanges();
        }
    }

    public List<LeaseAgreement> GetAllLandlordsLeases(string landlordId) {
        return _context.LeaseAgreements.Include(la => la.Tenants)
            .Where(la => la.LandlordId.ToString() == landlordId).ToList();
    }
}

public interface ILeaseService {
    public LeaseAgreement? GetLeaseById(string id);
    public LeaseAgreement CreateLease(CreateLeaseDTO lease, string landlordId);
    public void DeleteLease(string leaseId);
    List<LeaseAgreement> GetAllLandlordsLeases(string landlordId);
}

public record CreateLeaseDTO(string Address, DateTime LeaseStart, DateTime LeaseEnd, decimal RentAmount,
    List<TenantDTO> Tenants);

public record TenantDTO(string FirstName, string LastName);