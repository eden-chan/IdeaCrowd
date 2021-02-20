import { types } from "mobx-state-tree";

const Template = types
  .model("Template", {
    eatBool: false,
    cleanBool: false,
    healthBool: false,
    sleepBool: false,
    breatheBool: false,
    petBool: false,
    full: 30,
    clean: 30,
    energy: 40,
    happy: 40,
    calm: 40,
    health: 40,
    level: 2,
    levelProgress: 50,
    name: "odie", 
    scarf: false, 
    glasses: false,
  })
  .actions(self => ({
    checkLevelUp() {
      if (self.full >= 100 && self.clean >= 100 && self.health >= 100 && self.energy >= 100 && self.calm >= 100 && self.happy >= 100) {
        self.levelProgress += 10
        if (self.levelProgress >= 100){
          self.level += 1
          self.levelProgress = 0
        } 
      }
    }
  }))
  .actions(self => ({
    handleEat(val){
      self.eatBool = val
      self.cleanBool = false; 
      self.healthBool = false; 
      self.sleepBool = false; 
      self.breatheBool = false; 
      self.petBool = false;
      if (self.full >= 100) return
      if (val) {
        self.cleanBool = false; 
        self.healthBool = false; 
        self.sleepBool = false; 
        self.breatheBool = false; 
        self.petBool = false;
        self.full = Math.min(100, self.full + 10)
        self.checkLevelUp()
      }
    }, 
    handleClean(val){
      self.healthBool = false; 
      self.sleepBool = false; 
      self.breatheBool = false; 
      self.petBool = false;
      self.eatBool = false;
      self.cleanBool = val
      if (self.clean >= 100) return
      if (val) {
        self.healthBool = false; 
        self.sleepBool = false; 
        self.breatheBool = false; 
        self.petBool = false;
        self.eatBool = false;
        self.clean = Math.min(100, self.clean +10)
        self.checkLevelUp()
      }
    }, 
    handlePlay(val){
      self.healthBool = val
      self.sleepBool = false; 
      self.breatheBool = false; 
      self.petBool = false;
      self.eatBool = false;
      self.cleanBool = false;
      if (self.health >= 100) return
      if (val) {
        self.sleepBool = false; 
        self.breatheBool = false; 
        self.petBool = false;
        self.eatBool = false;
        self.cleanBool = false;
        self.health = Math.min(100, self.health +10)
        self.checkLevelUp()
      }
    }, 
    handleSleep(val){
      self.sleepBool = val
      self.healthBool = false; 
      self.breatheBool = false; 
      self.petBool = false;
      self.eatBool = false;
      self.cleanBool = false;
      if (self.energy >= 100) return
      if (val) {
        self.healthBool = false; 
        self.breatheBool = false; 
        self.petBool = false;
        self.eatBool = false;
        self.cleanBool = false;
        self.energy = Math.min(100, self.energy + 10)
        self.checkLevelUp()
      }
    }, 
    handleBreathe(val){
      self.breatheBool = val
      self.healthBool = false; 
      self.sleepBool = false; 
      self.petBool = false;
      self.eatBool = false;
      self.cleanBool = false;
      if (self.calm >= 100) return
      if (val) {
        self.healthBool = false; 
        self.sleepBool = false; 
        self.petBool = false;
        self.eatBool = false;
        self.cleanBool = false;
        self.calm = Math.min(100, self.calm + 10)
        self.checkLevelUp()
      }
    }, 
    handlePet(val){
      self.petBool = val
      self.healthBool = false; 
      self.sleepBool = false; 
      self.breatheBool = false; 
      self.eatBool = false;
      self.cleanBool = false;
      if (self.happy >= 100) return
      if (val) {
        self.healthBool = false; 
        self.sleepBool = false; 
        self.breatheBool = false; 
        self.eatBool = false;
        self.cleanBool = false;
        self.happy = Math.min(100, self.happy + 10)
        self.checkLevelUp()
      }
    },
    setName(name){
      self.name = name
    }, 
    setHealth(val){
      self.health = val
    }, 
    setFull(val){
      self.full = val 
    }, 
    setClean(val){
      self.clean = val
    }, 
    setEnergy(val){
      self.energy = val
    }, 
    setHappy(val){
      self.happy = val
    }, 
    setCalm(val){
      self.calm = val
    }, 
    setLevel(val){
      self.level = val
    }, 
    setLvlProgress(val){
      self.levelProgress = val
    }, 
    setScarf(val){
      self.scarf = val
    }, 
    setGlasses(val){
      self.glasses = val
    }
  }))
  .views(self => ({
  }));

export default Template;
