using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace Tests;

public class SeleniumFixture : IDisposable {
    public IWebDriver Driver { get; private set; }

    public SeleniumFixture()
    {
        var options = new ChromeOptions();
        options.AddArgument("--headless");
        options.AddArgument("--disable-gpu");
        options.AddArgument("--window-size=1920,1080");

        Driver = new ChromeDriver(options);
    }

    public void Dispose()
    {
        Driver.Quit();
    }
}