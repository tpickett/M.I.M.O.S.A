import { defineStore } from 'pinia'
import axios from 'axios'
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_HOST}/api/`,
  timeout: 3000
});

export interface SinglePart { 
  id: number;
  image: string;
  link: string;
  name: string;
  position: string;
  quantity: number
}

const usePartStore = defineStore('parts', {
  state: () => {
    return {
      itemList: [] as SinglePart[],
    }
  },
  getters: {
    findItem: (state) => {
      return (id: number) => state.itemList.find((item:SinglePart) => item.id === id)
    }
  },
  actions: {
    createPart(part: SinglePart){
      instance.post(`items`, part, {headers:{
        'Content-Type': "application/json"
      }})
      .then((resp: any) => {
        let newPart = resp.data
        console.log("response", newPart)
        this.itemList = [newPart, ...this.itemList]
      })
    },
    edit(part: SinglePart){
      return instance.put(`items/${part.id}`, part, {headers:{
        'Content-Type': "application/json"
      }})
      .then(() => {
        let objIndex = this.itemList.findIndex((obj => obj.id == part.id));
        this.itemList[objIndex] = part
      })
    },
    delete(part: SinglePart){
      instance.delete(`items/${part.id}`).then(resp => {
        this.itemList = this.itemList.filter(item=>item.id !== part.id)
      })
    },
    locate(part: SinglePart){
      instance.post(`items/${part.id}`, {action: 'locate'}, {headers:{
        'Content-Type': "application/x-www-form-urlencoded"
      }})
    },
    incrementQuantity(){},
    decrementQuantity(){},
    findByOrganizer(organizer_id: string){
      return instance.get(`organizers/${organizer_id}/parts`).then((response: any)=> response.data)
    },
    find(){
      instance.get("items").then( (response: any) => {
        this.itemList = response.data
      })
    }
  }
})

export default usePartStore
