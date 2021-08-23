var fs = require("fs");
var request = require('request');

var response = null
var userid = null
var password = null
var noproxy = false
var sslverify = true
var url = null
var cert = null
var timeout = 3600
var basicauth = null
var auth = null
var apipath = '/ae/api/v1'

async function connect(options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = null;
    }

    if (options.noproxy != null) noproxy = options.noproxy;
    if (options.sslverify != null) sslverify = options.sslverify;
    if (options.userid != null && options.userid.trim() != "") userid = options.userid;
    if (options.password != null && options.password.trim() != "") password = options.password;
    if (options.basicauth != null || options.basicauth.trim() != "") basicauth =  options.basicauth;
    if (options.url != null && options.url.trim() != "") url = options.url;
    if (options.cert != null && options.cert.trim() != "") cert = options.cert;
    if (options.timeout != null && options.timeout.toString().trim() != "") timeout = options.timeout;
    
    if (callback == null) callback = defaultCallback;

    //handleSSL()
    handleProxy()
    setAuth()
    return this
}

exports.connect = connect

const setPath = (str, cl) => {
    return str.replace("{client_id}", cl)
}


const setAuth = () => {
    if (basicauth != null) {
        auth = "Basic " + basicauth
    } else {
        auth = "Basic " + Buffer.from(userid + ":" + password).toString("base64");
    }
}

const handleProxy = () => {
    if (noproxy == true) {
        const urlObject = new URL(url);
        const domain = urlObject.hostname;
        process.env['NO_PROXY'] = domain;
    }
}

const handleSSL = () => {
    if (sslverify == false) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        process.emitWarning = (warning, options) => {
            if (warning && warning.includes && warning.includes('NODE_TLS_REJECT_UNAUTHORIZED')) {
                return
            }
            return originalEmitWarning.call(process, warning, options)
        }
    }
}

const getUrl = (path) => {
    return  url + apipath + path
}

function doRequest(opt) {
    console.log(timeout)
    if (opt.body == null) opt.body = {};
    return new Promise(function(resolve, reject) {
        try {
            request({
                    url: getUrl(opt.path),
                    method: opt.method,
                    //requestCert: false,
                    headers: {
                        "Authorization": auth,
                        'Content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    //timeout: timeout,
                    body: JSON.stringify(opt.body)
                },
                function(error, response, body) {
                    if (opt.path == '/ping'){
                        var data = {}
                    }else{
                        var data = JSON.parse(body)
                    }

                    data.statusCode = response.statusCode
                    
                    if (!error && response.statusCode == 200) {
                        data.statusTest = 'success'
                        resolve(data);
                    } else {
                        data.statusTest = 'error'
                        resolve(data);
                    }
                }
            )
        } catch {
            return {
                "error": "url unreachable"
            }
        }
    })
}

function defaultCallback(err) {
    if (err) throw err;
}


async function activateScript(client_id, body=null){
    // Summary: Runs scripts written in the Automation Engine scripting language. 
    var path = '/{client_id}/scripts'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.activateScript = activateScript

async function branchDiff(client_id, branch_name=null, query=null){
    // Summary: Get content of two files to see their differences. 
    var path = '/{client_id}/repositories/branches/{branch_name}/diff'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{branch_name}', branch_name)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.branchDiff = branchDiff

async function branchLog(client_id, branch_name=null, query=null){
    // Summary: Retrieves the history of the repository for max_results entries. 
    var path = '/{client_id}/repositories/branches/{branch_name}/log'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{branch_name}', branch_name)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.branchLog = branchLog

async function changeExecutionStatus(client_id, run_id, body=null){
    // Summary: Changes the status of an execution. 
    var path = '/{client_id}/executions/{run_id}/status'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{run_id}', run_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.changeExecutionStatus = changeExecutionStatus

async function commitChanges(client_id, body=null){
    // Summary: Commits only changed objects for client to repository. 
    var path = '/{client_id}/repositories/commits'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.commitChanges = commitChanges

async function computeErtEstimations(client_id, run_id){
    // Summary: Get ERT estimations for the given workflow. 
    var path = '/{client_id}/executions/{run_id}/ert'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{run_id}', run_id)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.computeErtEstimations = computeErtEstimations

async function createBranch(client_id, body=null){
    // Summary: Create a new branch. 
    var path = '/{client_id}/repositories/branches'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.createBranch = createBranch

async function createComments(client_id, run_id, body=null){
    // Summary: Appends a comment to a given execution. 
    var path = '/{client_id}/executions/{run_id}/comments'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{run_id}', run_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.createComments = createComments

async function createForecast(client_id, body=null){
    // Summary: Create a forecast. 
    var path = '/{client_id}/forecasts'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.createForecast = createForecast

async function createRepository(client_id, body=null){
    // Summary: Initializes the repository for the specified client. 
    var path = '/{client_id}/repositories'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.createRepository = createRepository

async function deleteClients(client_id, target_client_id=null, body=null){
    // Summary: Delete a client 
    var path = '/{client_id}/system/clients/{client_id}'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{target_client_id}', target_client_id)
    return await doRequest({
        path: path,
        method: 'delete',
        body: body
    })
}   

exports.deleteClients = deleteClients

async function deleteForecast(client_id, body=null){
    // Summary: Delete forecasts using ids. 
    var path = '/{client_id}/forecasts'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'delete',
        body: body
    })
}   

exports.deleteForecast = deleteForecast

async function deleteRepository(client_id, body=null){
    // Summary: Abort merging so we get out of merging state. 
    var path = '/{client_id}/repositories/merge'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'delete'
    })
}   

exports.deleteRepository = deleteRepository

async function executeObject(client_id, body=null){
    // Summary: Execute an object with or without input parameters (promptsets variables). 
    var path = '/{client_id}/executions'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.executeObject = executeObject

async function exportTelemetry(client_id, start_from=null){
    // Summary: Retrieve telemetry data per month as json for the last n months, including the current month. Only works for client 0. 
    var path = '/{client_id}/telemetry/export/{start_from}'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{start_from}', start_from)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.exportTelemetry = exportTelemetry

async function findObjects(client_id, body=null){
    // Summary: Search the process assembly for objects using different filter criteria. 
    var path = '/{client_id}/search'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.findObjects = findObjects

async function getAgentDetails(client_id, object_name=null){
    // Summary: Returns detailed agent information 
    var path = '/{client_id}/system/agents/{object_name}'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{object_name}', object_name)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.getAgentDetails = getAgentDetails

async function getChanges(client_id, query=null){
    // Summary: Returns a list of objects that have uncommitted changes. 
    var path = '/{client_id}/repositories/changes'
    var path = path.replace('{client_id}', client_id)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.getChanges = getChanges

async function getChildrenOfExecution(client_id, run_id, query=null){
    // Summary: Gets all immediate execution children, ordered descending by activation_time and run_id. 
    var path = '/{client_id}/executions/{run_id}/children'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{run_id}', run_id)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.getChildrenOfExecution = getChildrenOfExecution

async function getExecution(client_id, run_id, query=null){
    // Summary: Get details of a given execution. 
    var path = '/{client_id}/executions/{run_id}'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{run_id}', run_id)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.getExecution = getExecution

async function getFeatureList(client_id){
    // Summary: Retrieve system feature information. 
    var path = '/{client_id}/system/features'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.getFeatureList = getFeatureList

async function getForecast(client_id, forecast_id=null, query=null){
    // Summary: Get details of a given forecast. 
    var path = '/{client_id}/forecasts/{forecast_id}'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{forecast_id}', forecast_id)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.getForecast = getForecast

async function getObjects(client_id, object_name=null, query=null){
    // Summary: Can be used to export single objects by name 
    var path = '/{client_id}/objects/{object_name}'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{object_name}', object_name)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.getObjects = getObjects

async function getRepository(client_id){
    // Summary: Retrieves repository information for the given client. 
    var path = '/{client_id}/repositories'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.getRepository = getRepository

async function getTimezoneInfo(client_id, object_name=null){
    // Summary: Returns the time zone used by an object definition or defaults if the object or time zone does not exist. 
    var path = '/{client_id}/objects/{object_name}/timezone'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{object_name}', object_name)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.getTimezoneInfo = getTimezoneInfo

async function healthCheck(client_id){
    // Summary: Can be used to determine if the automation system is in a healthy state. A system is healthy if there is a PWP and at least one instance of CP and JWP respectively. When healthy, HTTP 200 is returned. When unhealthy, HTTP 503. Note: only use the HTTP status code to determine the health status since the response body is optional. 
    var path = '/{client_id}/system/health'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.healthCheck = healthCheck

async function listAgentgroups(client_id){
    // Summary:  
    var path = '/{client_id}/system/agentgroups'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.listAgentgroups = listAgentgroups

async function listAgents(client_id, query=null){
    // Summary: Lists all agents that are defined in the system. The returned list contains running and stopped agents. 
    var path = '/{client_id}/system/agents'
    var path = path.replace('{client_id}', client_id)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.listAgents = listAgents

async function listBranches(client_id, query=null){
    // Summary: Retrieves a list of branches. 
    var path = '/{client_id}/repositories/branches'
    var path = path.replace('{client_id}', client_id)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.listBranches = listBranches

async function listClients(client_id){
    // Summary: List of clients in the system. 
    var path = '/{client_id}/system/clients'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.listClients = listClients

async function listComments(client_id, run_id){
    // Summary: List all comments for a given execution. 
    var path = '/{client_id}/executions/{run_id}/comments'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{run_id}', run_id)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.listComments = listComments

async function listExecutions(client_id, query=null){
    // Summary: List executions, ordered descending by activation_time and run_id. 
    var path = '/{client_id}/executions'
    var path = path.replace('{client_id}', client_id)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.listExecutions = listExecutions

async function listForecastAgents(client_id, query=null){
    // Summary: List forecast agents and gaps. 
    var path = '/{client_id}/forecasts/agents'
    var path = path.replace('{client_id}', client_id)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.listForecastAgents = listForecastAgents

async function listForecasts(client_id, query=null){
    // Summary: List all forecasts, ordered descending by start_time. 
    var path = '/{client_id}/forecasts'
    var path = path.replace('{client_id}', client_id)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.listForecasts = listForecasts

async function listObjectInputs(client_id, object_name=null){
    // Summary: List all inputs for a given object. 
    var path = '/{client_id}/objects/{object_name}/inputs'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{object_name}', object_name)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.listObjectInputs = listObjectInputs

async function listReportContent(client_id, run_id, report_type=null, query=null){
    // Summary: Report content pages. 
    var path = '/{client_id}/executions/{run_id}/reports/{report_type}'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{run_id}', run_id)
    var path = path.replace('{report_type}', report_type)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.listReportContent = listReportContent

async function listReports(client_id, run_id){
    // Summary: Report list for a given execution. 
    var path = '/{client_id}/executions/{run_id}/reports'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{run_id}', run_id)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.listReports = listReports

async function listVariables(client_id, run_id){
    // Summary: List all variables for a given execution. 
    var path = '/{client_id}/executions/{run_id}/variables'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{run_id}', run_id)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.listVariables = listVariables

async function mergeBranchIntoActive(client_id, body=null){
    // Summary: Merge another branch in active branch. 
    var path = '/{client_id}/repositories/merge'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.mergeBranchIntoActive = mergeBranchIntoActive

async function modifyForecast(client_id, forecast_id=null, body=null){
    // Summary: Changes the title of a forecast item. 
    var path = '/{client_id}/forecasts/{forecast_id}'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{forecast_id}', forecast_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.modifyForecast = modifyForecast

async function moveHead(client_id, commit_id=null, body=null){
    // Summary: Imports version of provided GIT Hash to automation engine. 
    var path = '/{client_id}/repositories/commits/{commit_id}'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{commit_id}', commit_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.moveHead = moveHead

async function ping(){
    // Summary: Can be used to determine if the JCP process is currently running. 
    var path = '/ping'
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.ping = ping

async function postObjects(client_id, body=null, query=null){
    // Summary: Can be used to import single objects 
    var path = '/{client_id}/objects'
    var path = path.replace('{client_id}', client_id)
    if (query != null) path += '?'+query
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.postObjects = postObjects

async function productList(client_id){
    // Summary: Retrieve available products 
    var path = '/{client_id}/telemetry/products'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.productList = productList

async function pullRepository(client_id, body=null){
    // Summary: Pull changes from repository for active branch. 
    var path = '/{client_id}/repositories/pull'
    var path = path.replace('{client_id}', client_id)
    return await doRequest({
        path: path,
        method: 'post',
        body: body
    })
}   

exports.pullRepository = pullRepository

async function usageForCalendarEvents(client_id, object_name=null, event_name=null){
    // Summary: Returns a list of objects with a reference name, a boolean to show if the actual result has hidden objects due to acl conflicts, for the given objectname 
    var path = '/{client_id}/objects/{object_name}/usage/calendarevent/{event_name}'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{object_name}', object_name)
    var path = path.replace('{event_name}', event_name)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.usageForCalendarEvents = usageForCalendarEvents

async function usageObject(client_id, object_name=null){
    // Summary: Returns a list of objects with a reference name, a boolean to show if the actual result has hidden objects due to acl conflicts, for the given objectname 
    var path = '/{client_id}/objects/{object_name}/usage'
    var path = path.replace('{client_id}', client_id)
    var path = path.replace('{object_name}', object_name)
    return await doRequest({
        path: path,
        method: 'get'
    })
}   

exports.usageObject = usageObject
