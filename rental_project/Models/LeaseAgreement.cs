namespace rental_project.Models; 

public class LeaseAgreement {
    public Guid Id { get; set; }
    public Guid LandlordId { get; set; }
    public string Address { get; set; }
    public DateTime SignedAt { get; set; }
    public DateTime LeaseStart { get; set; }
    public DateTime LeaseEnd { get; set; }
    public Decimal RentAmount { get; set; }
    public List<Tenant> Tenants { get; set; }
}