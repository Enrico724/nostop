
type UserData = {
    nome: string;
    cognome: string;
}

type UserInfo = UserData & {
    id: number
}

type User = UserInfo & {
    entrato: boolean
}

export type {
    UserData,
    UserInfo,
    User
}