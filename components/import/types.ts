type Message = string[] | string;
interface IDict {
    [key: string]: any;
}
export interface IYunzai {
    uin: number[];
    pickFriend: (user_id: number) => User;
    pickGroup: (group_id: number) => Group;
    pickMember: (group_id: number, user_id: number) => GroupUser;
}
export interface IBot {
    uin: number;
    nickname: string;
    fl: Map<number, User>;
    gl: Map<number, Group>;
    pickFriend: (user_id: number) => User;
    pickGroup: (group_id: number) => Group;
    pickMember: (group_id: number, user_id: number) => GroupUser;
    getFriendList: () => User[];
    getFriendMap: () => Map<number, User>;
    getGroupList: () => Group[];
    getGroupMap: () => Map<number, Group>;
}
export interface User {
    user_id: number;
    card?: string; // Only for GroupMember
    sendMsg: (msg: Message) => void;
    recallMsg: (message_id: number) => void;
    makeForwardMsg: (msg: Message) => Message;
    getInfo: () => IDict; // User info
    getAvatarUrl: () => string;
}
export interface Group {
    group_id: number;
    sendMsg: (msg: Message) => void;
    recallMsg: (message_id: number) => void;
    makeForwardMsg: (msg: Message) => Message;
    getInfo: () => IDict; // Group info
    getAvatarUrl: () => string;
    getMemberList: () => GroupUser[];
    getMemberMap: () => Map<number, GroupUser>;
    pickMember: (user_id: number) => GroupUser;
    pokeMember: (user_id: number) => void;
    setName: (group_name: string) => void;
    setAvatar: (file: string) => void;
    setAdmin: (user_id: number, enable: boolean) => void;
}
export interface GroupUser extends User {
    pickFriend: () => User;
    poke: () => void;
}
export interface Segment {
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
