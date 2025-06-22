interface IDict {
    [key: string]: any;
}

export interface IYunzai {
    uin: number[];
    pickFriend: (user_id: number) => User;
    pickGroup: (group_id: number) => Group;
    pickMember: (group_id: number, user_id: number) => GroupUser;
}

export type MessageResponse = { message: MessageSegment[] };
export interface IBot {
    uin: number;
    nickname: string;
    fl: Map<number, User>;
    gl: Map<number, Group>;
    pickFriend: (user_id: number) => User;
    pickGroup: (group_id: number) => Group;
    pickMember: (group_id: number, user_id: number) => GroupUser;
    getFriendList: () => Promise<User[]>;
    getFriendMap: () => Promise<Map<number, User>>;
    getGroupList: () => Promise<Group[]>;
    getGroupMap: () => Promise<Map<number, Group>>;

    makeMsg: () => Promise<[MessageSegment[], any[]]>;
    recallMsg: (message_id: string | string[]) => Promise<any[]>;
    getMsg: (message_id: string) => Promise<MessageResponse>;
    getForwardMsg: (message_id: string) => Promise<MessageResponse | MessageResponse[]>;
    makeForwardMsg: (msgs: ForwardMessage[]) => Promise<MessageSegment[]>;
}

export interface ISegment {
    image: (file: string, type?: string, subType?: string) => string;
    at: (user_id: number, name: string) => string;
    record: (file: string) => string;
    video: (file: string) => string;
    reply: (id, text, qq, time, seq) => string;
    face: (id) => string;
    share: (url, title, content, image) => string;
    music: (type, id, url, audio, title) => string;
    poke: (qq) => string;
    gift: (qq, id) => string;
    xml: (data, resid) => string;
    json: (data, resid) => string;
    cardimage: (file, minwidth, minheight, maxwidth, maxheight, source, icon) => string;
    tts: (text) => string;
    custom: (type, data) => string;
}

export interface MessageSegment {
    type: "text" | "image" | "record" | "video" | "reply" | "face" | "share" | "music" | "poke" | "gift" | "xml" | "json" | "cardimage" | "tts" | "raw" | "markdown" | "node" | "custom";
    data?: IDict;
    qq?: number;
    url?: string;
    name?: string;
    id?: string; // Reply message_id
    text?: string; // Reply text or message text
}
export type Message = MessageSegment | string | (MessageSegment | string)[];

export interface ForwardMessage {
    message: Message;
    nickname?: string;
    user_id?: number;
    time?: number; // Date.now() / 1000
}
export interface SendMessageResult {
    message_id: string | string[]; // Message ID
    data?: any[];
}

export interface User {
    user_id: number;

    sendMsg: (msg: Message) => Promise<SendMessageResult>;
    recallMsg: (message_id: string | string[]) => Promise<any[]>;
    makeForwardMsg: (msgs: ForwardMessage[]) => Promise<MessageSegment[]>;
    getInfo: () => IDict; // User info
    getAvatarUrl: () => string;

    getChatHistory: (message_seq: number, count: number, reversedOrder?: boolean) => Promise<MessageResponse[]>;
}

export interface Group {
    group_id: number;

    sendMsg: (msg: Message) => Promise<SendMessageResult>;
    recallMsg: (message_id: string | string[]) => Promise<any[]>;
    makeForwardMsg: (msgs: ForwardMessage[]) => Promise<MessageSegment[]>;
    getInfo: () => IDict; // Group info

    getAvatarUrl: () => string;
    getMemberList: () => GroupUser[];
    getMemberMap: () => Map<number, GroupUser>;
    pickMember: (user_id: number) => GroupUser;
    pokeMember: (user_id: number) => void;
    setName: (group_name: string) => void;
    setAvatar: (file: string) => void;
    setAdmin: (user_id: number, enable: boolean) => void;

    getChatHistory: (message_seq: number, count: number, reversedOrder?: boolean) => Promise<MessageResponse[]>;
}

export interface GroupUser extends User {
    card: string; // Group member card (nickname in group)

    pickFriend: () => User;
    poke: () => void;
}
