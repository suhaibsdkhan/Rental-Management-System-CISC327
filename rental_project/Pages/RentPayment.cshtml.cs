using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using rental_project.Services;

namespace rental_project.Pages;

public class RentPayment : PageModel {
    private readonly IPaymentService _paymentService;

    public RentPayment(IPaymentService paymentService) {
        _paymentService = paymentService;
    }

    public Models.RentPayment RentPaymentModel { get; set; }
    public IActionResult OnGet(string paymentId) {
        var rp = _paymentService.GetRentPaymentById(paymentId);
        if (rp is null) {
            return RedirectToPage("/Unauthorized");
        }
        RentPaymentModel = rp;
        return Page();
    }
}