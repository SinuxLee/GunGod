const ModuleEventEnum = require('ModuleEventEnum')

cc.Class({
  extends: cc.Component,
  properties: {
    crateBoomPre: cc.Prefab
  },

  onLoad () {
    this._first = true
    this._kills = {}
    this.frameCount = 0
    this.reflectCount = 0
  },

  start () {
    if(this.node.master.match('suffer')) {
      // 拖尾效果
      this.node.getChildByName('tail').getComponent(cc.MotionStreak).color = cc.color(255, 255, 255)
    }
  },

  onBeginContact (contact, self, other) {
    if (self.node.group == 'bullet' && other.node.group == 'body') {
      if (this._kills[other.node.parent.name] == null){
        if (this.reflectCount <= 0 && other.node.parent.name == 'role') return
        this._hitman = other.node.parent
        this.hit = true
        this.out = false

        if (this._hitman && this._hitman.getChildByName('blood')) {
          const blood = cc.instantiate(this._hitman.getChildByName('blood'))
          blood.active = true
          blood.getComponent(cc.ParticleSystem).resetSystem()
          blood.parent = other.node
        }
      }
      this._kills[other.node.parent.name] = true
      cc.systemEvent.emit(ModuleEventEnum.KILLED, other.node.parent.name)
      return
    }

    if (self.node.group == 'bullet' && this._first && 
      (other.node.group == 'border' || other.node.group == 'prop')) {
      const hitEarth = cc.instantiate(cc.director.getScene().getChildByName('Canvas').getChildByName('hitEarth'))
      const levelPlay = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay')
      
      hitEarth.position = levelPlay.convertToNodeSpaceAR(self.node.convertToWorldSpaceAR(cc.v2()))
      hitEarth.getComponent(cc.ParticleSystem).autoRemoveOnFinish = true
      hitEarth.getComponent(cc.ParticleSystem).resetSystem()
      levelPlay.addChild(hitEarth)
      this._first = false
    }

    this.reflectCount++
    window.audio.getComponent('SoundManager').playEffect('reflect')

    if(this.reflectCount > 20) {
      window.facade.getComponent('LevelModel').useABullet()
      this.node.removeFromParent()
    }
  },

  onPreSolve (contact, self, other) {
    if (self.node.group == 'bullet' && other.node.group == 'body') {
      contact.disabled = true
      if(!this.out){
        other.node.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(10000, 10000))
      }
      return
    }
    
    self.body.isCross = false
    if (self.node.group == 'bullet' && other.node.group == 'box') {
      const crateBoom = cc.instantiate(this.crateBoomPre)
      const levelPlay = cc.director.getScene().getChildByName('Canvas').getChildByName('levelPlay')

      crateBoom.position = levelPlay.convertToNodeSpaceAR(other.node.convertToWorldSpaceAR(cc.v2()))
      crateBoom.getComponent(cc.ParticleSystem).autoRemoveOnFinish = true
      crateBoom.getComponent(cc.ParticleSystem).resetSystem()
      levelPlay.addChild(crateBoom)
      other.node.removeFromParent()
    }
  },

  onPostSolve (contact, self, other) {
    if(self.node.group == 'bullet' && other.node.group == 'body'){
      contact.disabled = true
      this.out = true
    }
    self.body.isCross = false
  },

  update (dt) {
    this.frameCount++
    const worldPos = this.node.convertToWorldSpaceAR(cc.v2());
    if(worldPos.x < -500 || worldPos.x > 1300 || 
      worldPos.y <= -500 || worldPos.y > 2000) {
      window.facade.getComponent('LevelModel').useABullet()
      this.node.removeFromParent()
    }
  }
})
