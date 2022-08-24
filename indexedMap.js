class Item {
    constructor(value, key = undefined){
        this.key = key;
        this.value = value;
    }
}
class IndexedMap {
    constructor(){
        this.items = [];
    }

    #getIndex(key){
        for (let i = 0; i < this.items.length; i++){
            if (this.items[i].key === key){
                return i;
            }
        }

        return -1;
    }

    set(key, value) {
        let index = this.#getIndex(key);
        if (index == -1){
            this.items.push(new Item(value, key));
        }
        else {
            this.items[index].value = value;
        }

        return this;
    }

    has(key) {
        return this.#getIndex(key) != -1;
    }

    hasIndex(index) {
        return index > -1 && index <= this.items.length - 1;
    }

    get(key) {
        let index = this.#getIndex(key);
        if (index == -1) {
            return undefined;
        }

        return this.items[index].value;
    }

    getByIndex(index) {
        if (!this.hasIndex(index)){
            return undefined;
        }

        return this.items[index].value;
    }

    remove(key) {
        let index = this.#getIndex(key);
        if (index == -1) {
            return undefined;
        }

        this.items.splice(index, 1);
        return this;
    }

    size() {
        return this.items.length;
    }

    uniq() {
        let arr = [];
        for (let i = 0; i < this.items.length; i++){
            let isUniq = true;
            let value1 = this.items[i].value;
            for (let j = i + 1; j < this.items.length; j++){
                let value2 = this.items[j].value;
                if(value1 == value2){
                    isUniq = false;
                    break;
                }
            }
            if (isUniq){
                arr.push(value1);
            }
        }

        return arr;
    }

    union(...maps) {
        for (let i = 0; i < maps.length; i++){
            for(const [key, value] of maps[i]){
                this.set(key, value);
            }
        }

        return this;
    }

    sort(callback = (value1, value2, key1, key2) => {
        if (isNaN(value1) && !isNaN(value2)) return 1;
        if (!isNaN(value1) && isNaN(value2)) return -1;
        return value1 < value2 ? -1 : 1
    }) {
        for (let i = 0; i < this.items.length; i++){
            for (let j = 0; j < this.items.length - 1; j++){
                const item1 = this.items[j];
                const item2 = this.items[j + 1];
                const result = callback(item1.value, item2.value, item1.key, item2.key);
                if (result > 0){
                    this.items[j] = item2;
                    this.items[j + 1] = item1;
                }
            }
        }
        
        return this;
    }

    setTo(index, value) {
        this.items.splice(index + 1, 0, new Item(value))
        return this;
    }

    removeAt(index, count = 1) {
        if (!this.hasIndex(index) || index + count >= this.items.length){
            return undefined;
        }

        this.items.splice(index + 1, count);
        return this;
    }
}

/*let indexedMap = new IndexedMap();
indexedMap.set(0, 0)
indexedMap.set("4", 4)
indexedMap.set("1", 1)
indexedMap.set("2", 2)
indexedMap.set("2", 1)
indexedMap.set("test", "test")

let map1 = new Map();
map1.set(1, 2)
map1.set('1', "newValue")

let map2 = new Map();
map2.set(3, 3)
map2.set('test2', "newTest2")
map2.set('test', "newTest")


indexedMap.union(map1, map2)*/