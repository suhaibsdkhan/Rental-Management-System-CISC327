namespace rental_project.Models; 

public class RentPayment {
    public Guid Id { get; set; }
    public LeaseAgreement LeaseAgreement { get; set; }
    public DateTime PaymentDeadline { get; set; }
}