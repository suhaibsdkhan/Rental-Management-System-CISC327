using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace Tests;

public class EndToEndTests : IClassFixture<SeleniumFixture>
{
    private readonly IWebDriver _driver;

    public EndToEndTests(SeleniumFixture fixture)
    {
        _driver = fixture.Driver;
    }

    [Fact]
    public void Register_Successfully()
    {
        _driver.Navigate().GoToUrl("http://localhost:8080");

        var openSignupButton = _driver.FindElement(By.Id("open-signup-modal"));
        openSignupButton.Click();

        var random = new Random();
        var randomEmail = $"testuser{random.Next(1000, 99999999)}@example.com";

        var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(2));
        var emailField = wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementIsVisible(By.Id("signup-email")));
        wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementToBeClickable(By.Id("signup-email")));
        emailField.SendKeys(randomEmail);

        var passwordField = _driver.FindElement(By.Id("signup-password"));
        passwordField.SendKeys("StrongPassword123!");

        var repeatPasswordField = _driver.FindElement(By.Id("signup-repeat-password"));
        repeatPasswordField.SendKeys("StrongPassword123!");

        var signupButton = _driver.FindElement(By.Id("signup-button"));
        signupButton.Click();
        wait.Until(driver => driver.FindElement(By.Id("signup-error")));

        var response = _driver.FindElement(By.Id("signup-error")).Text;
        Assert.Equal("", response); // no error
    }

    [Fact]
    public void SaveLease_Successfully()
    {
        //Login
        _driver.Navigate().GoToUrl("http://localhost:8080");

        var emailField = _driver.FindElement(By.Id("email"));
        emailField.SendKeys("admin@admin.com");

        var passwordField = _driver.FindElement(By.Id("password"));
        passwordField.SendKeys("Test1234!");

        var loginButton = _driver.FindElement(By.Id("login-button"));
        loginButton.Click();

        //Wait until login is successful
        var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(15));
        wait.Until(driver => driver.Url.Contains("dashboard"));

        //Go to the lease agreement page
        _driver.Navigate().GoToUrl("http://localhost:8080/lease-agreement");

        //Test Lease
        wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(15));

        var addressField = _driver.FindElement(By.Id("adress"));
        addressField.SendKeys("123 Test Street");

        var rentField = _driver.FindElement(By.Id("rent"));
        rentField.SendKeys("1234");

        var addButton = _driver.FindElement(By.Id("add-button"));
        addButton.Click();

        var tenantInputs = wait.Until(driver => driver.FindElements(By.ClassName("tenant-input")));

        var inputField = tenantInputs.First();
        inputField.SendKeys("John Doe");

        var saveButton = _driver.FindElement(By.Id("pdf-button"));
        saveButton.Click();

        wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.AlertIsPresent());
        var alert = _driver.SwitchTo().Alert();

        Assert.Contains("Lease saved successfully", alert.Text);
        alert.Accept();
    }

    [Fact]
    public void LeaseRetrieve_NotSuccessfull()
    {
        //Login
        _driver.Navigate().GoToUrl("http://localhost:8080");

        var emailField = _driver.FindElement(By.Id("email"));
        emailField.SendKeys("admin@admin.com"); 

        var passwordField = _driver.FindElement(By.Id("password"));
        passwordField.SendKeys("Test1234!"); 

        var loginButton = _driver.FindElement(By.Id("login-button"));
        loginButton.Click();

        //Wait until login is successful
        var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(15));
        wait.Until(driver => driver.Url.Contains("dashboard"));

        //Go to the get lease page
        _driver.Navigate().GoToUrl("http://localhost:8080/get-lease");

        var addressInput = _driver.FindElement(By.Id("addressInput"));
        var retrieveButton = _driver.FindElement(By.Id("Retrieve"));

        string testAddress = "123 Wrong Street";
        addressInput.SendKeys(testAddress);

        retrieveButton.Click();

        wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(15));
        var alert = wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.AlertIsPresent());

        Assert.Equal("No matching lease found for the provided address.", alert.Text);
        alert.Accept();
    }
}