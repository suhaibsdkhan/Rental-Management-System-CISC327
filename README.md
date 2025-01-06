
# Rental Management System

A comprehensive system for managing rental properties and their associated workflows. Developed for CISC 327, this project highlights modular design, robust testing, and operational efficiency.

## Table of Contents
1. [Overview](#overview)  
2. [Features](#features)  
3. [Getting Started](#getting-started)  
4. [Project Workflow](#project-workflow)  
5. [Testing](#testing)  
6. [Contributing](#contributing)  
7. [License](#license)  
8. [Contact](#contact)  

---

## Overview

The **Rental Management System** supports end-to-end operations for managing residential and commercial rental properties. It facilitates tenant management, lease agreements, rent payments, and maintenance requests. The system includes an intuitive user interface, seamless backend functionality, and a robust testing framework.

This project was built collaboratively by **Group 30-TA**:
- [Suhaib](https://github.com/suhaibsdkhan)  
- [Dovydas](https://github.com/DovydasLatkauskas)  
- [Will](https://github.com/WillW0426)  

---

## Features

1. **User Authentication**:  
   - Register/Login with secure credential handling.  
   - Ensure role-based access (tenant/owner).

2. **Property Management**:  
   - Add, update, and remove properties.  
   - Associate tenants with properties.

3. **Lease Agreements**:  
   - Create and manage leases.  
   - Retrieve lease agreements by property address or ID.

4. **Rent Payment Tracking**:  
   - Monitor payment statuses.  
   - Facilitate online payment processing via third-party platforms.

5. **Maintenance Management**:  
   - Submit and track maintenance requests.  

6. **Extensive Testing**:  
   - Unit, integration, and end-to-end tests to ensure system reliability.  

---

## Getting Started

### Prerequisites

- **Backend**: [.NET 8.0+](https://dotnet.microsoft.com/) runtime  
- **Frontend Testing**: [Node.js](https://nodejs.org/)  
- **Containerization**: Docker Engine & Docker Compose  

### Running the Project

1. **Clone the Repository**:  
   ```bash
   git clone https://github.com/suhaibsdkhan/Rental-Management-System-CISC327.git
   cd Rental-Management-System-CISC327
   ```

2. **Start the Backend**:  
   ```bash
   cd rental_project
   dotnet run --launch-profile "http"
   ```
   Open [http://localhost:5098](http://localhost:5098) in your browser.

3. **Using Docker**:  
   ```bash
   docker compose up --build
   ```
   Access the app at [http://localhost:8080](http://localhost:8080).

---

## Project Workflow

### Key URLs:
- **Login**: [http://localhost:8080](http://localhost:8080)  
- **Lease Agreement**: [http://localhost:8080/lease-agreement](http://localhost:8080/lease-agreement)  
- **Rent Payment**: [http://localhost:8080/rent-payment/00000000-0000-0000-0000-000000000001](http://localhost:8080/rent-payment/00000000-0000-0000-0000-000000000001)  

### Actions:
1. **Sign Up and Log In**.  
2. **Generate Test Data**:  
   [http://localhost:8080/generate-test-data](http://localhost:8080/generate-test-data)  
3. **View/Pay Rent**:  
   Use the sample rent payment ID above or generate your own.  

---

## Testing

### Backend Tests

1. Navigate to the `BackendTests` directory:
   ```bash
   cd BackendTests
   dotnet test
   ```

2. Execute code coverage:
   ```bash
   npm install
   npm test
   ```

### End-to-End Testing

1. Start the backend:
   ```bash
   docker compose up --build
   ```

2. Run the tests:
   ```bash
   cd BackendTests
   dotnet test
   ```

Tests include:
- **Register_Successfully**: Verifies successful user registration.  
- **SaveLease_Successfully**: Ensures lease agreements are saved.  
- **LeaseRetrieve_NotSuccessful**: Tests error handling for invalid retrievals.  

---

## Contributing

Contributions are welcome!  
1. Fork the repository.  
2. Create a feature branch.  
3. Push and create a pull request with your changes.

---

## License

This project is licensed under the MIT License. See `LICENSE` for details.

---

## Contact

For questions or issues:  
- **Suhaib**: [GitHub Profile](https://github.com/suhaibsdkhan)  
- **Dovydas**: [GitHub Profile](https://github.com/DovydasLatkauskas)  
- **Will**: [GitHub Profile](https://github.com/WillW0426)  

--- 

Feel free to reach out for suggestions or collaboration!
