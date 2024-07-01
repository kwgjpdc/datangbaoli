const useModelerStore = defineStore('modelerStore', {
    state: () => ({
        bpmnElement: undefined,
        activeElementId: undefined,
        modeler: null,
        moddle: null,
        modeling: null,
        canvas: null,
        elementRegistry: null,
        userList: [],
        roleList: [],
        expList: [],
    }),
    getters: {
        getBpmnElement: (state) => state.bpmnElement,
        getActiveId: (state) => state.activeElementId,
        getModeler: (state) => state.modeler,
        getModdle: (state) => state.moddle,
        getModeling: (state) => state.modeling,
        getCanvas: (state) => state.canvas,
        getElRegistry: (state) => state.elementRegistry,
        getUserList: (state) => state.userList,
        getRoleList: (state) => state.roleList,
        getExpList: (state) => state.expList
    },
    actions: {
        setDataList(key, data) {
            this[key] = data
        },
        setModeler(modeler) {
            this.modeler = modeler
        },
        setElement(element, id) {
            this.bpmnElement = element
            this.activeElementId = id
        },
        setModules(key, module) {
            this[key] = module
        },
    },
})
export default useModelerStore
