# SectorsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assignSectorToNgoSectorsSectorIdAssignNgoNgoIdPut**](#assignsectortongosectorssectoridassignngongoidput) | **PUT** /sectors/{sector_id}/assign/ngo/{ngo_id} | Assign Sector To Ngo|
|[**assignSectorToOperatorSectorsSectorIdAssignOperatorOperatorIdPut**](#assignsectortooperatorsectorssectoridassignoperatoroperatoridput) | **PUT** /sectors/{sector_id}/assign/operator/{operator_id} | Assign Sector To Operator|
|[**assignSectorToTeamLeadSectorsSectorIdAssignTeamLeadTeamLeadIdPut**](#assignsectortoteamleadsectorssectoridassignteamleadteamleadidput) | **PUT** /sectors/{sector_id}/assign/team-lead/{team_lead_id} | Assign Sector To Team Lead|
|[**createSectorSectorsPost**](#createsectorsectorspost) | **POST** /sectors/ | Create Sector|
|[**deleteSectorSectorsSectorIdDelete**](#deletesectorsectorssectoriddelete) | **DELETE** /sectors/{sector_id} | Delete Sector|
|[**getAllSectorsSectorsGet**](#getallsectorssectorsget) | **GET** /sectors/ | Get All Sectors|
|[**getCompletelyUnassignedSectorsSectorsUnassignedAllGet**](#getcompletelyunassignedsectorssectorsunassignedallget) | **GET** /sectors/unassigned/all | Get Completely Unassigned Sectors|
|[**getSectorByIdSectorsSectorIdGet**](#getsectorbyidsectorssectoridget) | **GET** /sectors/{sector_id} | Get Sector By Id|
|[**getSectorsByNgoSectorsNgoNgoIdGet**](#getsectorsbyngosectorsngongoidget) | **GET** /sectors/ngo/{ngo_id} | Get Sectors By Ngo|
|[**getSectorsByOperatorSectorsOperatorOperatorIdGet**](#getsectorsbyoperatorsectorsoperatoroperatoridget) | **GET** /sectors/operator/{operator_id} | Get Sectors By Operator|
|[**getSectorsByStatusSectorsStatusStatusGet**](#getsectorsbystatussectorsstatusstatusget) | **GET** /sectors/status/{status} | Get Sectors By Status|
|[**getSectorsByTeamLeadSectorsTeamLeadTeamLeadIdGet**](#getsectorsbyteamleadsectorsteamleadteamleadidget) | **GET** /sectors/team-lead/{team_lead_id} | Get Sectors By Team Lead|
|[**getSectorsWithAssignmentsSectorsWithAssignmentsGet**](#getsectorswithassignmentssectorswithassignmentsget) | **GET** /sectors/with-assignments | Get Sectors With Assignments|
|[**getUnassignedNgoSectorsSectorsUnassignedNgoGet**](#getunassignedngosectorssectorsunassignedngoget) | **GET** /sectors/unassigned/ngo | Get Unassigned Ngo Sectors|
|[**getUnassignedOperatorSectorsSectorsUnassignedOperatorGet**](#getunassignedoperatorsectorssectorsunassignedoperatorget) | **GET** /sectors/unassigned/operator | Get Unassigned Operator Sectors|
|[**getUnassignedTeamLeadSectorsSectorsUnassignedTeamLeadGet**](#getunassignedteamleadsectorssectorsunassignedteamleadget) | **GET** /sectors/unassigned/team-lead | Get Unassigned Team Lead Sectors|
|[**updateSectorStatusSectorsSectorIdStatusStatusPut**](#updatesectorstatussectorssectoridstatusstatusput) | **PUT** /sectors/{sector_id}/status/{status} | Update Sector Status|

# **assignSectorToNgoSectorsSectorIdAssignNgoNgoIdPut**
> SectorResponse assignSectorToNgoSectorsSectorIdAssignNgoNgoIdPut()

Assign a sector to an NGO.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

let sectorId: string; // (default to undefined)
let ngoId: string; // (default to undefined)

const { status, data } = await apiInstance.assignSectorToNgoSectorsSectorIdAssignNgoNgoIdPut(
    sectorId,
    ngoId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sectorId** | [**string**] |  | defaults to undefined|
| **ngoId** | [**string**] |  | defaults to undefined|


### Return type

**SectorResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **assignSectorToOperatorSectorsSectorIdAssignOperatorOperatorIdPut**
> SectorResponse assignSectorToOperatorSectorsSectorIdAssignOperatorOperatorIdPut()

Assign a sector to an Operator.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

let sectorId: string; // (default to undefined)
let operatorId: string; // (default to undefined)

const { status, data } = await apiInstance.assignSectorToOperatorSectorsSectorIdAssignOperatorOperatorIdPut(
    sectorId,
    operatorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sectorId** | [**string**] |  | defaults to undefined|
| **operatorId** | [**string**] |  | defaults to undefined|


### Return type

**SectorResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **assignSectorToTeamLeadSectorsSectorIdAssignTeamLeadTeamLeadIdPut**
> SectorResponse assignSectorToTeamLeadSectorsSectorIdAssignTeamLeadTeamLeadIdPut()

Assign a sector to a Team Lead.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

let sectorId: string; // (default to undefined)
let teamLeadId: string; // (default to undefined)

const { status, data } = await apiInstance.assignSectorToTeamLeadSectorsSectorIdAssignTeamLeadTeamLeadIdPut(
    sectorId,
    teamLeadId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sectorId** | [**string**] |  | defaults to undefined|
| **teamLeadId** | [**string**] |  | defaults to undefined|


### Return type

**SectorResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createSectorSectorsPost**
> SectorResponse createSectorSectorsPost(sectorCreate)

Create a new sector.

### Example

```typescript
import {
    SectorsApi,
    Configuration,
    SectorCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

let sectorCreate: SectorCreate; //

const { status, data } = await apiInstance.createSectorSectorsPost(
    sectorCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sectorCreate** | **SectorCreate**|  | |


### Return type

**SectorResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteSectorSectorsSectorIdDelete**
> deleteSectorSectorsSectorIdDelete()

Delete a sector.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

let sectorId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteSectorSectorsSectorIdDelete(
    sectorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sectorId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllSectorsSectorsGet**
> Array<SectorResponse> getAllSectorsSectorsGet()

Get all sectors.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

const { status, data } = await apiInstance.getAllSectorsSectorsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SectorResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCompletelyUnassignedSectorsSectorsUnassignedAllGet**
> Array<SectorResponse> getCompletelyUnassignedSectorsSectorsUnassignedAllGet()

Get sectors that are not assigned to any user (NGO, Team Lead, or Operator).

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

const { status, data } = await apiInstance.getCompletelyUnassignedSectorsSectorsUnassignedAllGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SectorResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSectorByIdSectorsSectorIdGet**
> SectorResponse getSectorByIdSectorsSectorIdGet()

Get a sector by ID.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

let sectorId: string; // (default to undefined)

const { status, data } = await apiInstance.getSectorByIdSectorsSectorIdGet(
    sectorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sectorId** | [**string**] |  | defaults to undefined|


### Return type

**SectorResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSectorsByNgoSectorsNgoNgoIdGet**
> Array<SectorResponse> getSectorsByNgoSectorsNgoNgoIdGet()

Get all sectors assigned to a specific NGO.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

let ngoId: string; // (default to undefined)

const { status, data } = await apiInstance.getSectorsByNgoSectorsNgoNgoIdGet(
    ngoId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ngoId** | [**string**] |  | defaults to undefined|


### Return type

**Array<SectorResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSectorsByOperatorSectorsOperatorOperatorIdGet**
> Array<SectorResponse> getSectorsByOperatorSectorsOperatorOperatorIdGet()

Get all sectors assigned to a specific Operator.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

let operatorId: string; // (default to undefined)

const { status, data } = await apiInstance.getSectorsByOperatorSectorsOperatorOperatorIdGet(
    operatorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **operatorId** | [**string**] |  | defaults to undefined|


### Return type

**Array<SectorResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSectorsByStatusSectorsStatusStatusGet**
> Array<SectorResponse> getSectorsByStatusSectorsStatusStatusGet()

Get all sectors with a specific status.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

let status: SectorStatus; // (default to undefined)

const { status, data } = await apiInstance.getSectorsByStatusSectorsStatusStatusGet(
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | **SectorStatus** |  | defaults to undefined|


### Return type

**Array<SectorResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSectorsByTeamLeadSectorsTeamLeadTeamLeadIdGet**
> Array<SectorResponse> getSectorsByTeamLeadSectorsTeamLeadTeamLeadIdGet()

Get all sectors assigned to a specific Team Lead.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

let teamLeadId: string; // (default to undefined)

const { status, data } = await apiInstance.getSectorsByTeamLeadSectorsTeamLeadTeamLeadIdGet(
    teamLeadId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamLeadId** | [**string**] |  | defaults to undefined|


### Return type

**Array<SectorResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSectorsWithAssignmentsSectorsWithAssignmentsGet**
> Array<SectorResponse> getSectorsWithAssignmentsSectorsWithAssignmentsGet()

Get all sectors with their assigned users loaded.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

const { status, data } = await apiInstance.getSectorsWithAssignmentsSectorsWithAssignmentsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SectorResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUnassignedNgoSectorsSectorsUnassignedNgoGet**
> Array<SectorResponse> getUnassignedNgoSectorsSectorsUnassignedNgoGet()

Get sectors that are not assigned to any NGO.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

const { status, data } = await apiInstance.getUnassignedNgoSectorsSectorsUnassignedNgoGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SectorResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUnassignedOperatorSectorsSectorsUnassignedOperatorGet**
> Array<SectorResponse> getUnassignedOperatorSectorsSectorsUnassignedOperatorGet()

Get sectors that are not assigned to any Operator.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

const { status, data } = await apiInstance.getUnassignedOperatorSectorsSectorsUnassignedOperatorGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SectorResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUnassignedTeamLeadSectorsSectorsUnassignedTeamLeadGet**
> Array<SectorResponse> getUnassignedTeamLeadSectorsSectorsUnassignedTeamLeadGet()

Get sectors that are not assigned to any Team Lead.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

const { status, data } = await apiInstance.getUnassignedTeamLeadSectorsSectorsUnassignedTeamLeadGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SectorResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateSectorStatusSectorsSectorIdStatusStatusPut**
> SectorResponse updateSectorStatusSectorsSectorIdStatusStatusPut()

Update the status of a sector.

### Example

```typescript
import {
    SectorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SectorsApi(configuration);

let sectorId: string; // (default to undefined)
let status: SectorStatus; // (default to undefined)

const { status, data } = await apiInstance.updateSectorStatusSectorsSectorIdStatusStatusPut(
    sectorId,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sectorId** | [**string**] |  | defaults to undefined|
| **status** | **SectorStatus** |  | defaults to undefined|


### Return type

**SectorResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

