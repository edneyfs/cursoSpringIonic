export interface ClienteDTO {
    id : string;
    nome : string;
    email : string;
    // a "?"" serve para informar que o atributo é opciona (não precisa ser preenchido)
    imageUrl? : string;
}
