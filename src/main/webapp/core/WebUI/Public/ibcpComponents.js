/**
 * Created by liyuanquan on 2017/9/1.
 */

/**
 * @description:自定义指令获取DOM节点
 * @author:liyuanquan
 */
Vue.directive("dom", {
    bind: function(el, binding) {
        var _obj = binding.value;
        if(_obj != null) {
            var key = Object.keys(binding.modifiers)[0] || "el";
            Vue.set(_obj, key, el);
        }
    }
});

/**
 * @description:基础表格组件
 * @author:liyuanquan
 */
Vue.component("gmp-table", {
    props: ["tableData", "defaultHeight"],
    data() {
        return {
            defaultSort: {prop: 'date', order: 'descending'}
        }
    },
    methods: {
        setCurrent(row) {
            this.$refs.singleTable.setCurrentRow(row);
        },
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        rowData(row, event, column) {
            this.$emit("get-row-data", row);
        }
    },
    template: `<el-table :data="tableData" :height="defaultHeight" border ref="singleTable" highlight-current-row  @current-change="handleCurrentChange" :default-sort="defaultSort" @row-click="rowData" style="width: 100%">
					<slot>
					</slot>
				</el-table>`
});

/**
 * @description:单选下拉框组件
 * @author:liyuanquan
 */
Vue.component("single-selection", {
    // type
    props: ["isDisabled", "url", "initialValue"],
    data() {
        return {
            // 为了将子组件和外部解耦 最好将受影响的数据写在子组件内部 这样子组件就形成一个相对封闭的区间
            // options是调用后端接口 并且只获取一次
            options: [{
                value: '选项1',
                label: '重庆火锅'
            }, {
                value: '选项2',
                label: '老鸭粉丝汤'
            }, {
                value: '选项3',
                label: '小杨生煎'
            }, {
                value: '选项4',
                label: '潮汕牛肉火锅'
            }],
            selectValue: {
                values: []
            }
        };
    },
    methods: {
        changeSelect() {
            // 子组件向父组件传递的方法和参数
            this.$emit("change-data", this.selectValue.values);
        }
    },
    mounted() {
        this.selectValue.values = this.initialValue;
        // console.log(this.selectValue);
    },
    template: `<el-select @change="changeSelect" v-dom="selectValue" v-model="selectValue.values" :disabled="isDisabled" clearable="true" placeholder="请选择">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>`
});

/**
 * @description:多选下拉框组件
 * @author:liyuanquan
 */
Vue.component("multiple-selection", {
    // type
    props: ["isDisabled", "url", "initialValue"],
    data() {
        return {
            // 为了将子组件和外部解耦 最好将受影响的数据写在子组件内部 这样子组件就形成一个相对封闭的区间
            cities: [{
                value: 'Beijing',
                label: '北京'
            }, {
                value: 'Shanghai',
                label: '上海'
            }, {
                value: 'Nanjing',
                label: '南京'
            }, {
                value: 'Chengdu',
                label: '成都'
            }, {
                value: 'Shenzhen',
                label: '深圳'
            }, {
                value: 'Guangzhou',
                label: '广州'
            }, {
                value: 'Hangzhou',
                label: '杭州'
            }],
            selectValue: {
                values: []
            }
        };
    },
    methods: {
        changeSelect() {
            var _DOM = this.selectValue.el.children[1].lastElementChild;
            // 子组件向父组件传递的方法和参数
            this.$emit("change-datas", this.selectValue.values);
            this.$emit("change-datas", _DOM);
        }
    },
    mounted() {
        this.selectValue.values = this.initialValue;
    },
    template: `<el-select @change="changeSelect" v-dom="selectValue" v-model="selectValue.values" :disabled="isDisabled" multiple placeholder="请选择">
					<el-option
						v-for="item in cities"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>`
});

/**
 * @description:树形结构组件
 * @author:liyuanquan
 */
Vue.component("base-tree", {
    // 是否可过滤 默认展开的节点 默认选择的节点
    props: ["isFilter", "defaultExpandedKeys", "defaultCheckedKeys"],
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    data() {
        return {
            filterBool: false,
            filterText: "",
            defaultExpand: [],
            defalutCheck: [],
            datas: [{
                id: 1,
                label: '一级 1',
                children: [{
                    id: 4,
                    label: '二级 1-1',
                    children: [{
                        id: 9,
                        label: '三级 1-1-1'
                    }, {
                        id: 10,
                        label: '三级 1-1-2'
                    }]
                }]
            }, {
                id: 2,
                label: '一级 2',
                children: [{
                    id: 5,
                    label: '二级 2-1'
                }, {
                    id: 6,
                    label: '二级 2-2'
                }]
            }, {
                id: 3,
                label: '一级 3',
                children: [{
                    id: 7,
                    label: '二级 3-1'
                }, {
                    id:8,
                    label: '二级 3-2',
                    children: [{
                        id:11,
                        label: '三级 3-2-1'
                    }, {
                        id:12,
                        label: '三级 3-2-2'
                    }, {
                        id:13,
                        label: '三级 3-2-3'
                    }]
                }, {
                    id: 14,
                    label: '二级 3-3',
                    children: [{
                        id: 15,
                        label: '三级 3-3-1'
                    }, {
                        id: 16,
                        label: '三级 3-3-2'
                    }, {
                        id: 17,
                        label: '三级 3-3-3'
                    }]
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    mounted() {
        this.filterBool = this.isFilter;
        this.defaultExpand = this.defaultExpandedKeys;
        this.defalutCheck = this.defaultCheckedKeys;
    },
    methods: {
        getCheckedNodes() {
            this.$emit("get-checked-node", this.$refs.tree.getCheckedNodes())
        },
        getCheckedKeys() {
            this.$emit("get-checked-key", this.$refs.tree.getCheckedKeys())
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        }
    },
    template: `<div>
                    <el-input placeholder="输入关键字进行过滤" v-model="filterText" v-show="this.filterBool" style="margin-bottom: 8px;"></el-input>
                    <el-tree :data="datas" show-checkbox @node-click="getCheckedNodes" @check-change="getCheckedKeys" :default-expanded-keys="defaultExpandedKeys" :default-checked-keys="defalutCheck" node-key="id" ref="tree" highlight-current :props="defaultProps" :filter-node-method="filterNode">
                    </el-tree>
                </div>`
});