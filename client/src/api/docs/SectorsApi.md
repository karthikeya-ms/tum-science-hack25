# FastApi.SectorsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**assignSectorToNgoSectorsSectorIdAssignNgoNgoIdPut**](SectorsApi.md#assignSectorToNgoSectorsSectorIdAssignNgoNgoIdPut) | **PUT** /sectors/{sector_id}/assign/ngo/{ngo_id} | Assign Sector To Ngo
[**assignSectorToOperatorSectorsSectorIdAssignOperatorOperatorIdPut**](SectorsApi.md#assignSectorToOperatorSectorsSectorIdAssignOperatorOperatorIdPut) | **PUT** /sectors/{sector_id}/assign/operator/{operator_id} | Assign Sector To Operator
[**assignSectorToTeamLeadSectorsSectorIdAssignTeamLeadTeamLeadIdPut**](SectorsApi.md#assignSectorToTeamLeadSectorsSectorIdAssignTeamLeadTeamLeadIdPut) | **PUT** /sectors/{sector_id}/assign/team-lead/{team_lead_id} | Assign Sector To Team Lead
[**createSectorSectorsPost**](SectorsApi.md#createSectorSectorsPost) | **POST** /sectors/ | Create Sector
[**deleteSectorSectorsSectorIdDelete**](SectorsApi.md#deleteSectorSectorsSectorIdDelete) | **DELETE** /sectors/{sector_id} | Delete Sector
[**getAllSectorsSectorsGet**](SectorsApi.md#getAllSectorsSectorsGet) | **GET** /sectors/ | Get All Sectors
[**getCompletelyUnassignedSectorsSectorsUnassignedAllGet**](SectorsApi.md#getCompletelyUnassignedSectorsSectorsUnassignedAllGet) | **GET** /sectors/unassigned/all | Get Completely Unassigned Sectors
[**getSectorByIdSectorsSectorIdGet**](SectorsApi.md#getSectorByIdSectorsSectorIdGet) | **GET** /sectors/{sector_id} | Get Sector By Id
[**getSectorsByNgoSectorsNgoNgoIdGet**](SectorsApi.md#getSectorsByNgoSectorsNgoNgoIdGet) | **GET** /sectors/ngo/{ngo_id} | Get Sectors By Ngo
[**getSectorsByOperatorSectorsOperatorOperatorIdGet**](SectorsApi.md#getSectorsByOperatorSectorsOperatorOperatorIdGet) | **GET** /sectors/operator/{operator_id} | Get Sectors By Operator
[**getSectorsByStatusSectorsStatusStatusGet**](SectorsApi.md#getSectorsByStatusSectorsStatusStatusGet) | **GET** /sectors/status/{status} | Get Sectors By Status
[**getSectorsByTeamLeadSectorsTeamLeadTeamLeadIdGet**](SectorsApi.md#getSectorsByTeamLeadSectorsTeamLeadTeamLeadIdGet) | **GET** /sectors/team-lead/{team_lead_id} | Get Sectors By Team Lead
[**getSectorsWithAssignmentsSectorsWithAssignmentsGet**](SectorsApi.md#getSectorsWithAssignmentsSectorsWithAssignmentsGet) | **GET** /sectors/with-assignments | Get Sectors With Assignments
[**getUnassignedNgoSectorsSectorsUnassignedNgoGet**](SectorsApi.md#getUnassignedNgoSectorsSectorsUnassignedNgoGet) | **GET** /sectors/unassigned/ngo | Get Unassigned Ngo Sectors
[**getUnassignedOperatorSectorsSectorsUnassignedOperatorGet**](SectorsApi.md#getUnassignedOperatorSectorsSectorsUnassignedOperatorGet) | **GET** /sectors/unassigned/operator | Get Unassigned Operator Sectors
[**getUnassignedTeamLeadSectorsSectorsUnassignedTeamLeadGet**](SectorsApi.md#getUnassignedTeamLeadSectorsSectorsUnassignedTeamLeadGet) | **GET** /sectors/unassigned/team-lead | Get Unassigned Team Lead Sectors
[**updateSectorStatusSectorsSectorIdStatusStatusPut**](SectorsApi.md#updateSectorStatusSectorsSectorIdStatusStatusPut) | **PUT** /sectors/{sector_id}/status/{status} | Update Sector Status



## assignSectorToNgoSectorsSectorIdAssignNgoNgoIdPut

> SectorResponse assignSectorToNgoSectorsSectorIdAssignNgoNgoIdPut(sectorId, ngoId)

Assign Sector To Ngo

Assign a sector to an NGO.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
let sectorId = "sectorId_example"; // String | 
let ngoId = "ngoId_example"; // String | 
apiInstance.assignSectorToNgoSectorsSectorIdAssignNgoNgoIdPut(sectorId, ngoId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sectorId** | **String**|  | 
 **ngoId** | **String**|  | 

### Return type

[**SectorResponse**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## assignSectorToOperatorSectorsSectorIdAssignOperatorOperatorIdPut

> SectorResponse assignSectorToOperatorSectorsSectorIdAssignOperatorOperatorIdPut(sectorId, operatorId)

Assign Sector To Operator

Assign a sector to an Operator.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
let sectorId = "sectorId_example"; // String | 
let operatorId = "operatorId_example"; // String | 
apiInstance.assignSectorToOperatorSectorsSectorIdAssignOperatorOperatorIdPut(sectorId, operatorId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sectorId** | **String**|  | 
 **operatorId** | **String**|  | 

### Return type

[**SectorResponse**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## assignSectorToTeamLeadSectorsSectorIdAssignTeamLeadTeamLeadIdPut

> SectorResponse assignSectorToTeamLeadSectorsSectorIdAssignTeamLeadTeamLeadIdPut(sectorId, teamLeadId)

Assign Sector To Team Lead

Assign a sector to a Team Lead.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
let sectorId = "sectorId_example"; // String | 
let teamLeadId = "teamLeadId_example"; // String | 
apiInstance.assignSectorToTeamLeadSectorsSectorIdAssignTeamLeadTeamLeadIdPut(sectorId, teamLeadId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sectorId** | **String**|  | 
 **teamLeadId** | **String**|  | 

### Return type

[**SectorResponse**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## createSectorSectorsPost

> SectorResponse createSectorSectorsPost(sectorCreate)

Create Sector

Create a new sector.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
let sectorCreate = new FastApi.SectorCreate(); // SectorCreate | 
apiInstance.createSectorSectorsPost(sectorCreate, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sectorCreate** | [**SectorCreate**](SectorCreate.md)|  | 

### Return type

[**SectorResponse**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## deleteSectorSectorsSectorIdDelete

> deleteSectorSectorsSectorIdDelete(sectorId)

Delete Sector

Delete a sector.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
let sectorId = "sectorId_example"; // String | 
apiInstance.deleteSectorSectorsSectorIdDelete(sectorId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sectorId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getAllSectorsSectorsGet

> [SectorResponse] getAllSectorsSectorsGet()

Get All Sectors

Get all sectors.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
apiInstance.getAllSectorsSectorsGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**[SectorResponse]**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getCompletelyUnassignedSectorsSectorsUnassignedAllGet

> [SectorResponse] getCompletelyUnassignedSectorsSectorsUnassignedAllGet()

Get Completely Unassigned Sectors

Get sectors that are not assigned to any user (NGO, Team Lead, or Operator).

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
apiInstance.getCompletelyUnassignedSectorsSectorsUnassignedAllGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**[SectorResponse]**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getSectorByIdSectorsSectorIdGet

> SectorResponse getSectorByIdSectorsSectorIdGet(sectorId)

Get Sector By Id

Get a sector by ID.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
let sectorId = "sectorId_example"; // String | 
apiInstance.getSectorByIdSectorsSectorIdGet(sectorId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sectorId** | **String**|  | 

### Return type

[**SectorResponse**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getSectorsByNgoSectorsNgoNgoIdGet

> [SectorResponse] getSectorsByNgoSectorsNgoNgoIdGet(ngoId)

Get Sectors By Ngo

Get all sectors assigned to a specific NGO.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
let ngoId = "ngoId_example"; // String | 
apiInstance.getSectorsByNgoSectorsNgoNgoIdGet(ngoId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ngoId** | **String**|  | 

### Return type

[**[SectorResponse]**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getSectorsByOperatorSectorsOperatorOperatorIdGet

> [SectorResponse] getSectorsByOperatorSectorsOperatorOperatorIdGet(operatorId)

Get Sectors By Operator

Get all sectors assigned to a specific Operator.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
let operatorId = "operatorId_example"; // String | 
apiInstance.getSectorsByOperatorSectorsOperatorOperatorIdGet(operatorId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **operatorId** | **String**|  | 

### Return type

[**[SectorResponse]**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getSectorsByStatusSectorsStatusStatusGet

> [SectorResponse] getSectorsByStatusSectorsStatusStatusGet(status)

Get Sectors By Status

Get all sectors with a specific status.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
let status = new FastApi.SectorStatus(); // SectorStatus | 
apiInstance.getSectorsByStatusSectorsStatusStatusGet(status, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | [**SectorStatus**](.md)|  | 

### Return type

[**[SectorResponse]**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getSectorsByTeamLeadSectorsTeamLeadTeamLeadIdGet

> [SectorResponse] getSectorsByTeamLeadSectorsTeamLeadTeamLeadIdGet(teamLeadId)

Get Sectors By Team Lead

Get all sectors assigned to a specific Team Lead.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
let teamLeadId = "teamLeadId_example"; // String | 
apiInstance.getSectorsByTeamLeadSectorsTeamLeadTeamLeadIdGet(teamLeadId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **teamLeadId** | **String**|  | 

### Return type

[**[SectorResponse]**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getSectorsWithAssignmentsSectorsWithAssignmentsGet

> [SectorResponse] getSectorsWithAssignmentsSectorsWithAssignmentsGet()

Get Sectors With Assignments

Get all sectors with their assigned users loaded.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
apiInstance.getSectorsWithAssignmentsSectorsWithAssignmentsGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**[SectorResponse]**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getUnassignedNgoSectorsSectorsUnassignedNgoGet

> [SectorResponse] getUnassignedNgoSectorsSectorsUnassignedNgoGet()

Get Unassigned Ngo Sectors

Get sectors that are not assigned to any NGO.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
apiInstance.getUnassignedNgoSectorsSectorsUnassignedNgoGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**[SectorResponse]**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getUnassignedOperatorSectorsSectorsUnassignedOperatorGet

> [SectorResponse] getUnassignedOperatorSectorsSectorsUnassignedOperatorGet()

Get Unassigned Operator Sectors

Get sectors that are not assigned to any Operator.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
apiInstance.getUnassignedOperatorSectorsSectorsUnassignedOperatorGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**[SectorResponse]**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getUnassignedTeamLeadSectorsSectorsUnassignedTeamLeadGet

> [SectorResponse] getUnassignedTeamLeadSectorsSectorsUnassignedTeamLeadGet()

Get Unassigned Team Lead Sectors

Get sectors that are not assigned to any Team Lead.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
apiInstance.getUnassignedTeamLeadSectorsSectorsUnassignedTeamLeadGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**[SectorResponse]**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## updateSectorStatusSectorsSectorIdStatusStatusPut

> SectorResponse updateSectorStatusSectorsSectorIdStatusStatusPut(sectorId, status)

Update Sector Status

Update the status of a sector.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.SectorsApi();
let sectorId = "sectorId_example"; // String | 
let status = new FastApi.SectorStatus(); // SectorStatus | 
apiInstance.updateSectorStatusSectorsSectorIdStatusStatusPut(sectorId, status, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sectorId** | **String**|  | 
 **status** | [**SectorStatus**](.md)|  | 

### Return type

[**SectorResponse**](SectorResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

