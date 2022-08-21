/**
 * @jest-environment jsdom
 */

 import { screen, waitFor } from "@testing-library/dom"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import {localStorageMock} from "../__mocks__/localStorage.js";
 import mockStore from "../__mocks__/store"
 import store from "../__mocks__/store";
 import userEvent from "@testing-library/user-event";
 import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
 import router from "../app/Router.js";
 
 jest.mock("../app/store", () => mockStore)
 
 describe("Given I am connected as an employee", () => {
 
   describe("when we chose picture file", () => {
     test("then the file must be accepted", () => {
       const str = JSON.stringify('logo picture');
       const blob = new Blob([str]);
       const file = new File([blob], 'logo.jpeg', {
         type: 'image/jpeg',
       });
 
       const isPicture = (objectFile) => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(objectFile.type);
       const isPictureResult = isPicture(file)
       expect(isPictureResult).toBeTruthy()
     })
   })
 
   describe("when we chose json file", () => {
     test("then the file must be rejected", () => {
       const str = JSON.stringify('logo picture');
       const blob = new Blob([str]);
       const file = new File([blob], 'key.json', {
         type: 'application/JSON',
       });
 
       const isPicture = (objectFile) => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(objectFile.type);
       const isPictureResult = isPicture(file)
       expect(isPictureResult).not.toBeTruthy()
     })
   })
 
   describe("when we chose picture file in create new bill page", () => {
     test("then the change event must be called", async () => {
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
 
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
 
       document.body.innerHTML = NewBillUI();
 
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname })
       }
       
       const newBillPage = new NewBill({
         document, onNavigate, store, localStorage: window.localStorage
       })
 
       await waitFor(() => screen.getByTestId('expense-name'))
 
       const expenseInput = screen.getByTestId('expense-name')
 
       expect(expenseInput.placeholder).toEqual('Vol Paris Londres')
 
       const handleChangeFileHandler = jest.fn((e) => newBillPage.handleChangeFile(e))
 
       const str = JSON.stringify('logo picture');
       const blob = new Blob([str]);
       const file = new File([blob], 'logo.jpeg', {
         type: 'image/jpeg',
       });
 
       const fileInput = screen.getByTestId('file')
 
       fileInput.addEventListener('change', handleChangeFileHandler)
 
       userEvent.upload(fileInput, file)
 
       expect(handleChangeFileHandler).toHaveBeenCalled()
     });
   })
 
   describe("when we chose json file in create new bill page", () => {
     test("then the change event must be called", async () => {
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
 
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
 
       document.body.innerHTML = NewBillUI();
 
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname })
       }
       
       const newBillPage = new NewBill({
         document, onNavigate, store, localStorage: window.localStorage
       })
 
       await waitFor(() => screen.getByTestId('expense-name'))
 
       const expenseInput = screen.getByTestId('expense-name')
 
       expect(expenseInput.placeholder).toEqual('Vol Paris Londres')
 
       const handleChangeFileHandler = jest.fn((e) => newBillPage.handleChangeFile(e))
 
       const str = JSON.stringify('logo picture');
       const blob = new Blob([str]);
       const file = new File([blob], 'key.json', {
         type: 'application/JSON',
       });
 
       const fileInput = screen.getByTestId('file')
 
       fileInput.addEventListener('change', handleChangeFileHandler)
 
       userEvent.upload(fileInput, file)
 
       expect(handleChangeFileHandler).toHaveBeenCalled()
     });
   })
 
   describe("when we submit create new bill", () => {
     test("then handleSubmit must be called", async () => {
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
 
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee',
         email: 'employee@email.domain'
       }))
 
       document.body.innerHTML = NewBillUI();
 
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname })
       }
       
       const newBillPage = new NewBill({
         document, onNavigate, store, localStorage: window.localStorage
       })
 
       await waitFor(() => screen.getByTestId('expense-name'))
 
       const expenseInput = screen.getByTestId('expense-name')
 
       expect(expenseInput.placeholder).toEqual('Vol Paris Londres')
 
       const handleChangeFileHandler = jest.fn((e) => newBillPage.handleChangeFile(e))
 
       const str = JSON.stringify('logo picture');
       const blob = new Blob([str]);
       const file = new File([blob], 'key.json', {
         type: 'application/JSON',
       });
 
       const fileInput = screen.getByTestId('file')
 
       fileInput.addEventListener('change', handleChangeFileHandler)
 
       userEvent.upload(fileInput, file)
 
       expect(handleChangeFileHandler).toHaveBeenCalled()
 
       //fill the input with data
       const expenseTypeInput = screen.getByTestId('expense-type'),
             expenseNameInput = screen.getByTestId('expense-name'),
             expenseDateInput = screen.getByTestId('datepicker'),
             expenseAmountInput = screen.getByTestId('amount'),
             vatInput = screen.getByTestId('vat'),
             pctInput = screen.getByTestId('pct'),
             commentary = screen.getByTestId('commentary');
 
       expenseTypeInput.value = 'Transports';
       expenseNameInput.value = 'expense name test';
       expenseDateInput.value = '2022-08-20';
       expenseAmountInput.value = '300';
       vatInput.value = '60';
       pctInput.value = '25';
       commentary.value = 'expense comentary test';
 
       //submit handler
       const handleSubmitHandler = jest.fn((e) => newBillPage.handleSubmit(e))
 
       //submut event listener
       const formSelector = screen.getByTestId('form-new-bill')
       formSelector.addEventListener('submit', handleSubmitHandler)
 
       //submit
       document.querySelector('#btn-send-bill').click()
 
       //must be called
       expect(handleSubmitHandler).toHaveBeenCalled()
     })
   })
 
   describe("When an error occurs on POST API", () => {
     beforeEach(() => {
       jest.spyOn(mockStore, "bills")
 
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
 
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee',
         email: 'employee@email.domain'
       }))
 
     })
 
     test("the should show error message in console", async () => {
 
       console.log = jest.fn();
 
       document.body.innerHTML = NewBillUI();
 
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname })
       }
       
       const newBillPage = new NewBill({
         document, onNavigate, store, localStorage: window.localStorage
       })
 
       await waitFor(() => screen.getByTestId('expense-name'))
 
       const expenseInput = screen.getByTestId('expense-name')
 
       expect(expenseInput.placeholder).toEqual('Vol Paris Londres')
 
       const handleChangeFileHandler = jest.fn((e) => newBillPage.handleChangeFile(e))
 
       const str = JSON.stringify('logo picture');
       const blob = new Blob([str]);
       const file = new File([blob], 'key.json', {
         type: 'application/JSON',
       });
 
       const fileInput = screen.getByTestId('file')
 
       fileInput.addEventListener('change', handleChangeFileHandler)
 
       userEvent.upload(fileInput, file)
 
       await new Promise(process.nextTick);
 
       expect(console.log).toHaveBeenCalledWith("le format du fichier sélectionné n'est pas pris en charge");
     })    
   })
 })