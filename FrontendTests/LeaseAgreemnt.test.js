import { JSDOM } from 'jsdom';
import { jest, test } from '@jest/globals';
import { setupEventListeners, setupEventListenersTestVersion } from "../rental_project/wwwroot/js/LeaseAgreement";

let window;
let document;

const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
    <body>
        <input type="text" id="adress" required>
        <input type="text" id="rent" required>
        <button id="add-button">Add Tenant</button>
        <div id="add-tenant-area"></div>
        <button id="pdf-button">Save</button>
    </body>
    </html>
`);

// Set the global window and document to the JSDOM ones
window = dom.window;
document = window.document;

// Set global window and document for the tests
global.window = window;
global.document = document;
global.alert = jest.fn();
// Call the function to set up event listeners
window.addEventListener("DOMContentLoaded", (event) => {
    setupEventListenersTestVersion(
        document.getElementById("adress"),
        document.getElementById('rent'),
        document.getElementById('add-button'),
        document.getElementById('add-tenant-area'),
        document.getElementById('pdf-button'),
    );   
   setupEventListeners();
});


describe('setupEventListeners', () => {
    beforeEach(() => {
        // Clear tenant inputs before each test
        //document.getElementById('add-tenant-area').innerHTML = '';
        document.getElementById('adress').value = '';
        document.getElementById('rent').value = '';
        jest.clearAllMocks();
    });

    test('All inputs to be filled.', () => {
        const pdfButton = document.getElementById('pdf-button');
        pdfButton.click();

        //expect(alert).toHaveBeenCalled();
        expect(alert).toHaveBeenCalledWith('Please fill out all input fields before generating the PDF.');
    });

    test('Rent must be numerical.', () => {
        document.getElementById('adress').value = '123 A Street';
        document.getElementById('rent').value = 'Not Numerical';

        const pdfButton = document.getElementById('pdf-button');
        pdfButton.click();

        //expect(alert).toHaveBeenCalled();
        expect(alert).toHaveBeenCalledWith('The rent value contains characters that are not numeric.');
    });

    test('There must be at lease one Tenant name.', () => {
        document.getElementById('adress').value = '123 A Street';
        document.getElementById('rent').value = '1234';

        const pdfButton = document.getElementById('pdf-button');
        pdfButton.click();

        //expect(alert).toHaveBeenCalled();
        expect(alert).toHaveBeenCalledWith('No tenants were added.');
    });

    test('All inputs are accepted.', () => {
        global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));

        document.getElementById('adress').value = '123 A Street';
        document.getElementById('rent').value = '1234';

        const tenantNameArea = document.getElementById('add-tenant-area');
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.placeholder = 'Tenant Name';
        newInput.required = true;
        newInput.className = 'tenant-input';
        newInput.value = "John Doe";

        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        inputContainer.appendChild(newInput);

        tenantNameArea.appendChild(inputContainer);

        const pdfButton = document.getElementById('pdf-button');
        pdfButton.click();

        expect(alert).not.toHaveBeenCalled();
    });
    
    test('Add button adds UI elemnts', () => {

        const addButton = document.getElementById('add-button');
        addButton.click();

        const newElement = document.querySelector('.input-container');
        expect(newElement).not.toBeNull();
    });

    test('Fetch response ok.', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ data: 'some data' }),
            })
        );

        document.getElementById('adress').value = '123 A Street';
        document.getElementById('rent').value = '1234';

        const tenantNameArea = document.getElementById('add-tenant-area');
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.placeholder = 'Tenant Name';
        newInput.required = true;
        newInput.className = 'tenant-input';
        newInput.value = "John Doe";

        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        inputContainer.appendChild(newInput);

        tenantNameArea.appendChild(inputContainer);

        const pdfButton = document.getElementById('pdf-button');
        pdfButton.click();

        expect(alert).toHaveBeenCalled;
    });

    test('Fetch response not ok.', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: false,
              status: 400,
              statusText: 'Bad Request',
              text: () => Promise.resolve('Error occurred'),
            })
        );

        document.getElementById('adress').value = '123 A Street';
        document.getElementById('rent').value = '1234';

        const tenantNameArea = document.getElementById('add-tenant-area');
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.placeholder = 'Tenant Name';
        newInput.required = true;
        newInput.className = 'tenant-input';
        newInput.value = "John Doe";

        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        inputContainer.appendChild(newInput);

        tenantNameArea.appendChild(inputContainer);

        const pdfButton = document.getElementById('pdf-button');
        pdfButton.click();

        expect(alert).toHaveBeenCalled;
    });
});