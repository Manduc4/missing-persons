import { PersonResponseProps } from "../services/store/actions/persons"

export  const getPersonUrl = (missingPerson: PersonResponseProps) => {
    if (missingPerson.urlFoto) return missingPerson.urlFoto
    if (missingPerson.sexo === "MASCULINO") return "https://media.istockphoto.com/id/2212478710/pt/vetorial/faceless-male-avatar-in-hoodie-illustration.jpg?s=612x612&w=0&k=20&c=N4FZ-3o1KvlEd-vZxtwE0kC-GlUgxImVBMY_Y71Kjlc="
    if (missingPerson.sexo === "FEMININO") return "https://media.istockphoto.com/id/2212478701/pt/vetorial/monochrome-female-silhouette-with-short-hair.jpg?s=612x612&w=0&k=20&c=zNlE8ftrOe6LBbbx3WIOR280jUVkgZvrqAA5ZQLkv-E="
    return "https://as2.ftcdn.net/v2/jpg/15/53/26/51/1000_F_1553265112_RNli3JfXSGyxux8O33TmiZwN83c4B8K8.jpg"
  }