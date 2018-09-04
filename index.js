const Customer = require('./lib/customer');
const Company = require('./lib/company');
const Currency = require('./lib/currency');
const Employee = require('./lib/employee');
const UserFile = require('./lib/userFile');
const ResourceGroup = require('./lib/resourceGroup');
const Supplier = require('./lib/supplier');
const SalesTerritory = require('./lib/salesTerritory');
const Jobs = require('./lib/jobs');
const JobOperations = require('./lib/jobOperations');
const ServiceBase = require('./lib/serviceBase');
const Labor = require('./lib/labor');
const LaborApproval = require('./lib/laborApproval');
const SalesOrder = require('./lib/salesOrder');
const Task = require('./lib/task');
const OrderJobWiz = require('./lib/orderJobWiz');
const BAQ = require('./lib/baq');
const Connection = require('./lib/connection');
const FindStream = require('./lib/utils/FindStream');
const SyncStream = require('./lib/utils/SyncStream');

function Epicor({ serverUrl, username, password, company, strictSSL }) {
  const connection = new Connection({
    serverUrl, username, password, company, strictSSL });
  this.connection = connection;
  this.ServiceBase = ServiceBase;
  this.FindStream = FindStream;
  this.SyncStream = SyncStream;

  this.getConnection = () => connection;
  this.setConnectionCompany = (_company) => { connection.company = _company; };
  this.getConnectionCompany = () => connection.company;

  this.Currency = new Currency(connection);
  this.Customer = new Customer(connection);
  this.Indirect = new ServiceBase(
    connection, 'Erp.BO.IndirectSvc', 'Indirect', 'IndirectCode');
  this.PerCon = new ServiceBase(
    connection, 'Erp.BO.PerConSvc', 'PerCon', 'PerConID');
  this.Image = new ServiceBase(
    connection, 'Erp.BO.ImageSvc', 'Image', 'ImageID');
  this.ResourceGroup = new ResourceGroup(connection);
  this.SalesTerritory = new SalesTerritory(connection);
  this.ShipVia = new ServiceBase(
    connection, 'Erp.BO.ShipViaSvc', 'ShipVia', 'ShipViaCode');
  this.Supplier = new Supplier(connection);
  this.Terms = new ServiceBase(
    connection, 'Erp.BO.TermsSvc', 'Terms', 'TermsCode');
  this.Employee = new Employee(connection);
  this.Project = new ServiceBase(
    connection, 'Erp.BO.ProjectSvc', 'Project', 'ProjectID');
  this.SalesOrder = new SalesOrder(connection);
  this.OrderJobWiz = new OrderJobWiz(connection);
  this.UserFile = new UserFile(connection);
  this.JobOperations = new JobOperations(connection);
  this.Jobs = new Jobs(connection);
  this.Task = new Task(connection);
  this.Labor = new Labor(connection);
  this.LaborApproval = new LaborApproval(connection);
  this.BAQ = new BAQ(connection);
  this.Company = new Company(connection);
}

module.exports = Epicor;
