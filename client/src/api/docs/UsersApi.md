# UsersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getActiveUsersUsersActiveAllGet**](#getactiveusersusersactiveallget) | **GET** /users/active/all | Get Active Users|
|[**getAllUsersUsersGet**](#getallusersusersget) | **GET** /users/ | Get All Users|
|[**getInactiveUsersUsersInactiveAllGet**](#getinactiveusersusersinactiveallget) | **GET** /users/inactive/all | Get Inactive Users|
|[**getNgosUsersNgosAllGet**](#getngosusersngosallget) | **GET** /users/ngos/all | Get Ngos|
|[**getOperatorsUsersOperatorsAllGet**](#getoperatorsusersoperatorsallget) | **GET** /users/operators/all | Get Operators|
|[**getTeamLeadsUsersTeamLeadsAllGet**](#getteamleadsusersteamleadsallget) | **GET** /users/team-leads/all | Get Team Leads|
|[**getUserByIdUsersUserIdGet**](#getuserbyidusersuseridget) | **GET** /users/{user_id} | Get User By Id|
|[**getUsersByParentUsersParentParentUserIdGet**](#getusersbyparentusersparentparentuseridget) | **GET** /users/parent/{parent_user_id} | Get Users By Parent|
|[**getUsersByRoleUsersRoleRoleGet**](#getusersbyroleusersroleroleget) | **GET** /users/role/{role} | Get Users By Role|
|[**getUsersByStatusUsersStatusStatusGet**](#getusersbystatususersstatusstatusget) | **GET** /users/status/{status} | Get Users By Status|

# **getActiveUsersUsersActiveAllGet**
> Array<UserResponse> getActiveUsersUsersActiveAllGet()

Get all active users.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.getActiveUsersUsersActiveAllGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<UserResponse>**

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

# **getAllUsersUsersGet**
> Array<UserResponse> getAllUsersUsersGet()

Get all users.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.getAllUsersUsersGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<UserResponse>**

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

# **getInactiveUsersUsersInactiveAllGet**
> Array<UserResponse> getInactiveUsersUsersInactiveAllGet()

Get all inactive users.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.getInactiveUsersUsersInactiveAllGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<UserResponse>**

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

# **getNgosUsersNgosAllGet**
> Array<UserResponse> getNgosUsersNgosAllGet()

Get all NGO users.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.getNgosUsersNgosAllGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<UserResponse>**

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

# **getOperatorsUsersOperatorsAllGet**
> Array<UserResponse> getOperatorsUsersOperatorsAllGet()

Get all Operator users, optionally filtered by Team Lead.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let teamLeadId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getOperatorsUsersOperatorsAllGet(
    teamLeadId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamLeadId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**Array<UserResponse>**

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

# **getTeamLeadsUsersTeamLeadsAllGet**
> Array<UserResponse> getTeamLeadsUsersTeamLeadsAllGet()

Get all Team Lead users, optionally filtered by NGO.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let ngoId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getTeamLeadsUsersTeamLeadsAllGet(
    ngoId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ngoId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**Array<UserResponse>**

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

# **getUserByIdUsersUserIdGet**
> UserResponse getUserByIdUsersUserIdGet()

Get a user by ID.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userId: string; // (default to undefined)

const { status, data } = await apiInstance.getUserByIdUsersUserIdGet(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | defaults to undefined|


### Return type

**UserResponse**

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

# **getUsersByParentUsersParentParentUserIdGet**
> Array<UserResponse> getUsersByParentUsersParentParentUserIdGet()

Get all users under a specific parent user.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let parentUserId: string; // (default to undefined)

const { status, data } = await apiInstance.getUsersByParentUsersParentParentUserIdGet(
    parentUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **parentUserId** | [**string**] |  | defaults to undefined|


### Return type

**Array<UserResponse>**

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

# **getUsersByRoleUsersRoleRoleGet**
> Array<UserResponse> getUsersByRoleUsersRoleRoleGet()

Get all users with a specific role.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let role: UserRole; // (default to undefined)

const { status, data } = await apiInstance.getUsersByRoleUsersRoleRoleGet(
    role
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **role** | **UserRole** |  | defaults to undefined|


### Return type

**Array<UserResponse>**

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

# **getUsersByStatusUsersStatusStatusGet**
> Array<UserResponse> getUsersByStatusUsersStatusStatusGet()

Get all users with a specific status.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let status: UserStatus; // (default to undefined)

const { status, data } = await apiInstance.getUsersByStatusUsersStatusStatusGet(
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | **UserStatus** |  | defaults to undefined|


### Return type

**Array<UserResponse>**

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

