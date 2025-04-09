## Camp activity board

### API Reference

#### Get all camps

```
GET /api/v1/camps
```

#### Get all activities

```
GET /api/v1/activities
```

#### Get camp and related activities

```
GET /api/v1/camps/${id}
```

```
GET /api/v1/camps/${id}/activities
```

| Parameter | Type     | Description   |
| :-------- | :------- | :------------ |
| `id`      | `string` | **Required**. |

#### Create new camp

```
POST /api/v1/camps
```

#### Delete camp

```
DELETE /api/v1/camps/${id}
```

| Parameter | Type     | Description   |
| :-------- | :------- | :------------ |
| `id`      | `string` | **Required**. |
