interface IJsonObject {
    [key: string]: any;
}

type EventMessageContent = string | number | IJsonObject;
