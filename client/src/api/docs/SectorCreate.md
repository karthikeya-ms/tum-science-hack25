# SectorCreate

DTO for creating a new sector. The geometry should be a valid GeoJSON Polygon.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**geometry** | **{ [key: string]: any; }** | A GeoJSON object representing the sector\&#39;s polygon. | [default to undefined]
**status** | [**SectorStatus**](SectorStatus.md) |  | [optional] [default to undefined]
**risk_probability** | **number** |  | [optional] [default to undefined]
**assigned_to_ngo_id** | **string** |  | [optional] [default to undefined]
**assigned_to_team_lead_id** | **string** |  | [optional] [default to undefined]
**assigned_to_operator_id** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { SectorCreate } from './api';

const instance: SectorCreate = {
    geometry,
    status,
    risk_probability,
    assigned_to_ngo_id,
    assigned_to_team_lead_id,
    assigned_to_operator_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
