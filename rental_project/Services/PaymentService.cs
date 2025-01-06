using Microsoft.EntityFrameworkCore;
using rental_project.Config;
using rental_project.Models;

namespace rental_project.Services;

public class PaymentService : IPaymentService {
    private readonly AppDbContext _context;

    public PaymentService(AppDbContext context) {
        _context = context;
    }

    public RentPayment? GetRentPaymentById(string id) {
        return _context.RentPayments.Include(rp => rp.LeaseAgreement)
            .FirstOrDefault(rp => rp.Id.ToString() == id);
    }
}

public interface IPaymentService {
    RentPayment? GetRentPaymentById(string id);
}