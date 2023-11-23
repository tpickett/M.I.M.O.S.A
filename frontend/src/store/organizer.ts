import { defineStore } from 'pinia'
import {SinglePart} from '@/store/part'
import axios, {AxiosResponse} from 'axios'
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_HOST}/api/`,
  timeout: 3000
});

export interface SingleOrganizer { 
  name: string;
  led_count: number;
  ip: string;
  id: string;
}

export interface partAssignment { 
  slot: string;
  part: number;
  id: string;
}

const useOrganizersStore = defineStore('organizers', {
  state: () => ({
    organizers: <SingleOrganizer[]>[],
    selected: {} as SingleOrganizer,
    selectedSlots: <SinglePart[]>[]
  }),
  actions: {
    update(organizer: SingleOrganizer){
      return instance.put(`organizers/${organizer.id}`, organizer, { 'headers': {'Content-type': 'application/json'}})
    },
    remove(organizer: SingleOrganizer){
      console.log(organizer)
      return instance.delete(`organizers/${organizer.id}`).then((resp: AxiosResponse)=>{
        if (resp.status === 200){
          this.organizers = this.organizers.filter((org: SingleOrganizer)=> org.id !== organizer.id )
        }
      })
    },
    test(led_slot: number, id: string){
      instance.get(`organizers/${id}/illuminate/${led_slot}`).then( (response: any) => {
        console.log(`illuminating led slot: ${led_slot}, at Organizer ID: ${id}`)
      })
    },
    locate(id: string){
      instance.get(`organizers/${id}/illuminate`).then( (response: any) => {
        console.log(`illuminating Organizer ID: ${id}`)
      })
    },
    add(organizer: SingleOrganizer){
      return instance.post("organizers", organizer, {headers: {'Content-type': 'application/json'}}).then( (response: any) => {
        return this.organizers.push(response.data)
      }).then(()=> {
        return <AxiosResponse>({})
      })
    },
    select(id: string){
      
      if (!this.organizers.length){
        return this.find().then(()=>{
          let objIndex = this.organizers.findIndex((obj => parseInt(obj.id) == parseInt(id)));
          this.selected = this.organizers[objIndex]  
        })
      } else {
        let objIndex = this.organizers.findIndex((obj => parseInt(obj.id) == parseInt(id)));
        this.selected = this.organizers[objIndex]
        return Promise.resolve()
      }
    },
    find(){
      return instance.get("organizers").then( (response: any) => {
        this.organizers = response.data
      })
    },
    assign(id: string, slot: number, part: number){
      return instance.post(`organizers/${id}/parts`, {slot: slot, part: part}, {headers: {'Content-type': 'application/json'}})
    },
    findSelectedParts(parts: any){
      let numLeds = this.selected.led_count
      let holding  = <any>{} 
      for (let index = 0; index < numLeds - 1; index++) {
        const n = `${index}`;
        holding[n] = {}
      }
      parts.find((item:any) => holding[item.position] = item )
      this.selectedSlots = holding
      },
  }
})
export default useOrganizersStore