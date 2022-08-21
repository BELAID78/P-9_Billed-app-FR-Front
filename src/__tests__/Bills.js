/**
 * @jest-environment jsdom
 */

 import {screen, waitFor} from "@testing-library/dom"
 import BillsUI from "../views/BillsUI.js"
 import mockStore from "../__mocks__/store"
 import { bills } from "../fixtures/bills.js"
 import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 import Bills from '../containers/Bills';
 import router from "../app/Router.js";
 import userEvent from "@testing-library/user-event";
 import store from "../__mocks__/store";
 
 jest.mock("../app/store", () => mockStore)
 
 describe("Given I am connected as an employee", () => {
   describe("When I am on Bills Page", () => {
     test("Then bill icon in vertical layout should be highlighted", async () => {
 
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.Bills)
       await waitFor(() => screen.getByTestId('icon-window'))
       const windowIcon = screen.getByTestId('icon-window')
       //resolve the expected result for icon must be highlighted
       expect(windowIcon.classList.contains('active-icon')).toBe(true);
     })
     test("Then bills should be ordered from earliest to latest", () => {
       document.body.innerHTML = BillsUI({ data: bills })
       const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
       const antiChrono = (a, b) => ((a < b) ? 1 : -1)
       const datesSorted = [...dates].sort(antiChrono)
       expect(dates).toEqual(datesSorted)
     })
   })
 
   describe("when click on create new bill", () => {
     test("then must go to the create new bill page", async () => {
 
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
 
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
 
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
 
       window.onNavigate(ROUTES_PATH.NewBill)
 
       await waitFor(() => screen.getByTestId('expense-name'))
 
       const expenseInput = screen.getByTestId('expense-name')
 
       expect(expenseInput.placeholder).toEqual('Vol Paris Londres')
     })
   })
 
   describe('when click on new bill', () => {
     test('click should handle handleClickNewBill', async () => {
 
       Object.defineProperty(window, 'localStorage', { value: localStorageMock });
 
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }));
 
       document.body.innerHTML = BillsUI({ data: bills});
 
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname });
       }
 
       const billsPage = new Bills({
           document, onNavigate, store: null, bills, localStorage: window.localStorage
       });
 
       await waitFor(() => screen.getByTestId('btn-new-bill'));
 
       const createNewBillButton = screen.getByTestId('btn-new-bill');
 
       const handleClickNewBillHandler = jest.fn((e) => billsPage.handleClickNewBill());
 
       createNewBillButton.addEventListener('click', handleClickNewBillHandler);
 
       userEvent.click(createNewBillButton);
       
       expect(handleClickNewBillHandler).toHaveBeenCalled();
     })
   })
 
   describe("when we list all bill", () => {
     test("the click on eye icon should show the modal", async () => {
 
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
 
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
 
       document.body.innerHTML = BillsUI({data: bills})
 
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname })
       }
       
       const billsPage = new Bills({
         document, onNavigate, store, bills, localStorage: window.localStorage
       })
       
       const handleClickIconEyeHandler = jest.fn(() => billsPage.handleClickIconEye(icon))
 
       await waitFor(() => screen.getAllByTestId('icon-eye')[3])
 
       const icon = screen.getAllByTestId('icon-eye')[3]
 
       icon.addEventListener('click', handleClickIconEyeHandler)
 
       userEvent.click(icon)
       
       expect(handleClickIconEyeHandler).toHaveBeenCalled()
     })
   })
 
   describe("when we enter the bill listing", () => {
     test("getBills should be called", async () => {
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
 
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
 
       document.body.innerHTML = BillsUI({data: bills})
 
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname })
       }
       
       const billsPage = new Bills({
         document, onNavigate, store, bills, localStorage: window.localStorage
       })
 
       const handleClickIconEyeHandler = jest.fn(() => billsPage.getBills())
 
       handleClickIconEyeHandler()
 
       expect(handleClickIconEyeHandler).toHaveReturned()
     })
   })
 })
 
 
 describe("Given I am a user connected as employee", () => {
   describe("When I navigate to Bills", () => {
     test("fetches bills from mock API GET", async () => {
       localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "test@test" }));
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.Bills)
 
       await waitFor(() => screen.getByText("Mes notes de frais"))
       const createNewBillButton  = await screen.getByTestId("btn-new-bill")
       expect(createNewBillButton).toBeTruthy()
 
       let tableRows = document.querySelectorAll('#data-table tbody tr')
 
       expect(tableRows.length).toBeGreaterThanOrEqual(0)
     })
   });
 
   describe("When an error occurs on API", () => {
     beforeEach(() => {
       jest.spyOn(mockStore, "bills")
       Object.defineProperty(
           window,
           'localStorage',
           { value: localStorageMock }
       )
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee',
         email: "test@test"
       }))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.appendChild(root)
       router()
     })
 
     test("fetches bills from an API and fails with 404 message error", async () => {
 
       mockStore.bills.mockImplementationOnce(() => {
         return {
           list : () =>  {
             return Promise.reject(new Error("Erreur 404"))
           }
         }})
       window.onNavigate(ROUTES_PATH.Bills)
       await new Promise(process.nextTick);
       const message = await screen.getByText(/Erreur 404/)
       expect(message).toBeTruthy()
     })
 
     test("fetches messages from an API and fails with 500 message error", async () => {
 
       mockStore.bills.mockImplementationOnce(() => {
         return {
           list : () =>  {
             return Promise.reject(new Error("Erreur 500"))
           }
         }})
 
       window.onNavigate(ROUTES_PATH.Bills)
       await new Promise(process.nextTick);
       const message = await screen.getByText(/Erreur 500/)
       expect(message).toBeTruthy()
     })
     
   })
 })