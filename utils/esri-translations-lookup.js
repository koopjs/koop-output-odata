var operators = {
  'eq': '=',
  'ne': '!=',
  'lt': '<',
  'le': '<=',
  'gt': '>',
  'ge': '>='
}

var enclose = function (val) {
  return typeof val === 'string' ? '\'' + val + '\'' : val
}

const lookup = {
  $top: {
    esri: 'resultRecordCount',
    translate: function (val) {
      return val
    }
  },
  $skip: {
    esri: 'resultOffset',
    translate: function (val) {
      return val
    }
  },
  $select: {
    esri: 'outFields',
    translate: function (val) {
      return val.join(', ')
    }
  },
  $filter: {
    esri: 'where',
    translate: function (val) {
      if (val.type === 'and' || val.type === 'or') {
        return [
          this.translate(val.left),
          val.type,
          this.translate(val.right)
        ].join(' ')
      } else {
        return [
          val.left.name,
          operators[val.type],
          enclose(val.right.value)
        ].join(' ')
      }
    }
  }
}

module.exports = lookup
