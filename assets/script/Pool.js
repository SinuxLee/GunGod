class Pool {
  constructor () {
    this._pools = {}
  }

  create (name, count, node) {
    let nodes = this._pools[name]
    if (nodes == null) {
      nodes = new cc.NodePool()
      this._pools[name] = nodes
    }

    for (let i = 0; i < count; i++) {
      if (i == 0) nodes.put(node)
      else nodes.put(cc.instantiate(node))
    }
  }

  put (name, node) {
    let nodes = this._pools[name]
    if (nodes == null) {
      cc.error('名为{0}的池对象不存在,新创建一个'.format(name))
      nodes = new cc.NodePool()
      this._pools[name] = nodes
    }

    nodes.put(node)
  }

  get (name) {
    const nodes = this._pools[name]
    if (nodes == null) {
      cc.error('名为{0}的池对象不存在'.format(name))
      return null
    } else if (nodes.size() == 0) return null
    else return nodes.get()
  }

  from (node) {
    const nodes = this._pools[node.name]
    if (nodes == null || nodes.size() == 0) {
      if (node.parent) {
        this.create(node.name, 1, cc.instantiate(node))
      } else {
        this.create(node.name, 1, node)
      }
      return this.get(node.name)
    } else return this.get(node.name)
  }

  has (name) {
    const nodes = this._pools[name]
    return nodes != null && nodes.size() != 0
  }

  clear (name) {
    const nodes = this._pools[name]
    if (nodes == null) return cc.error('名为{0}的池对象不存在'.format(name))

    nodes.clear()
    delete this._pools[name]
    cc.error('名为{0}的池对象已清空'.format(name))
  }

  clearAll () {
    for (const name in this._pools) this.clear(name)
  }
}

module.exports = new Pool()
