# FastApi.UsersApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getActiveUsersUsersActiveAllGet**](UsersApi.md#getActiveUsersUsersActiveAllGet) | **GET** /users/active/all | Get Active Users
[**getAllUsersUsersGet**](UsersApi.md#getAllUsersUsersGet) | **GET** /users/ | Get All Users
[**getInactiveUsersUsersInactiveAllGet**](UsersApi.md#getInactiveUsersUsersInactiveAllGet) | **GET** /users/inactive/all | Get Inactive Users
[**getNgosUsersNgosAllGet**](UsersApi.md#getNgosUsersNgosAllGet) | **GET** /users/ngos/all | Get Ngos
[**getOperatorsUsersOperatorsAllGet**](UsersApi.md#getOperatorsUsersOperatorsAllGet) | **GET** /users/operators/all | Get Operators
[**getTeamLeadsUsersTeamLeadsAllGet**](UsersApi.md#getTeamLeadsUsersTeamLeadsAllGet) | **GET** /users/team-leads/all | Get Team Leads
[**getUserByIdUsersUserIdGet**](UsersApi.md#getUserByIdUsersUserIdGet) | **GET** /users/{user_id} | Get User By Id
[**getUserByUsernameUsersUsernameUsernameGet**](UsersApi.md#getUserByUsernameUsersUsernameUsernameGet) | **GET** /users/username/{username} | Get User By Username
[**getUsersByParentUsersParentParentUserIdGet**](UsersApi.md#getUsersByParentUsersParentParentUserIdGet) | **GET** /users/parent/{parent_user_id} | Get Users By Parent
[**getUsersByRoleUsersRoleRoleGet**](UsersApi.md#getUsersByRoleUsersRoleRoleGet) | **GET** /users/role/{role} | Get Users By Role
[**getUsersByStatusUsersStatusStatusGet**](UsersApi.md#getUsersByStatusUsersStatusStatusGet) | **GET** /users/status/{status} | Get Users By Status



## getActiveUsersUsersActiveAllGet

> [UserResponse] getActiveUsersUsersActiveAllGet()

Get Active Users

Get all active users.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.UsersApi();
apiInstance.getActiveUsersUsersActiveAllGet((error, data, response) => {
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

[**[UserResponse]**](UserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getAllUsersUsersGet

> [UserResponse] getAllUsersUsersGet()

Get All Users

Get all users.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.UsersApi();
apiInstance.getAllUsersUsersGet((error, data, response) => {
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

[**[UserResponse]**](UserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getInactiveUsersUsersInactiveAllGet

> [UserResponse] getInactiveUsersUsersInactiveAllGet()

Get Inactive Users

Get all inactive users.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.UsersApi();
apiInstance.getInactiveUsersUsersInactiveAllGet((error, data, response) => {
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

[**[UserResponse]**](UserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getNgosUsersNgosAllGet

> [UserResponse] getNgosUsersNgosAllGet()

Get Ngos

Get all NGO users.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.UsersApi();
apiInstance.getNgosUsersNgosAllGet((error, data, response) => {
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

[**[UserResponse]**](UserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getOperatorsUsersOperatorsAllGet

> [UserResponse] getOperatorsUsersOperatorsAllGet(opts)

Get Operators

Get all Operator users, optionally filtered by Team Lead.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.UsersApi();
let opts = {
  'teamLeadId': "teamLeadId_example" // String | 
};
apiInstance.getOperatorsUsersOperatorsAllGet(opts, (error, data, response) => {
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
 **teamLeadId** | **String**|  | [optional] 

### Return type

[**[UserResponse]**](UserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getTeamLeadsUsersTeamLeadsAllGet

> [UserResponse] getTeamLeadsUsersTeamLeadsAllGet(opts)

Get Team Leads

Get all Team Lead users, optionally filtered by NGO.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.UsersApi();
let opts = {
  'ngoId': "ngoId_example" // String | 
};
apiInstance.getTeamLeadsUsersTeamLeadsAllGet(opts, (error, data, response) => {
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
 **ngoId** | **String**|  | [optional] 

### Return type

[**[UserResponse]**](UserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getUserByIdUsersUserIdGet

> UserResponse getUserByIdUsersUserIdGet(userId)

Get User By Id

Get a user by ID.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.UsersApi();
let userId = "userId_example"; // String | 
apiInstance.getUserByIdUsersUserIdGet(userId, (error, data, response) => {
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
 **userId** | **String**|  | 

### Return type

[**UserResponse**](UserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getUserByUsernameUsersUsernameUsernameGet

> [UserResponse] getUserByUsernameUsersUsernameUsernameGet(username)

Get User By Username

Get users by username.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.UsersApi();
let username = "username_example"; // String | 
apiInstance.getUserByUsernameUsersUsernameUsernameGet(username, (error, data, response) => {
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
 **username** | **String**|  | 

### Return type

[**[UserResponse]**](UserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getUsersByParentUsersParentParentUserIdGet

> [UserResponse] getUsersByParentUsersParentParentUserIdGet(parentUserId)

Get Users By Parent

Get all users under a specific parent user.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.UsersApi();
let parentUserId = "parentUserId_example"; // String | 
apiInstance.getUsersByParentUsersParentParentUserIdGet(parentUserId, (error, data, response) => {
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
 **parentUserId** | **String**|  | 

### Return type

[**[UserResponse]**](UserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getUsersByRoleUsersRoleRoleGet

> [UserResponse] getUsersByRoleUsersRoleRoleGet(role)

Get Users By Role

Get all users with a specific role.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.UsersApi();
let role = new FastApi.UserRole(); // UserRole | 
apiInstance.getUsersByRoleUsersRoleRoleGet(role, (error, data, response) => {
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
 **role** | [**UserRole**](.md)|  | 

### Return type

[**[UserResponse]**](UserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getUsersByStatusUsersStatusStatusGet

> [UserResponse] getUsersByStatusUsersStatusStatusGet(status)

Get Users By Status

Get all users with a specific status.

### Example

```javascript
import FastApi from 'fast_api';

let apiInstance = new FastApi.UsersApi();
let status = new FastApi.UserStatus(); // UserStatus | 
apiInstance.getUsersByStatusUsersStatusStatusGet(status, (error, data, response) => {
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
 **status** | [**UserStatus**](.md)|  | 

### Return type

[**[UserResponse]**](UserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

