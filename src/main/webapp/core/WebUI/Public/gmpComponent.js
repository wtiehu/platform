/**
 * Created by liyuanquan on 2017/9/6.
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
    // 设置参数
    props: ["initial"],
    data() {
        return {
            value: [],  // 下拉框选中绑定值
            name: [],   // 显示名称
            isDisabled: false,  // 下拉框是否禁用
            options: [],    // 下拉框option
            url: "",    // 获取option接口
            params: {},  // 调用接口参数
            isMultiple: false
        };
    },
    methods: {
        // 下拉框值改变时回调
        changeSelect(val) {
            // console.log(val);
            // 保存this指针
            var _this = this;
            // 向父组件传递的对象
            var _obj = {
                value: ""
            };

            if(val != null) {
                if(val.length > 0 || val != "") {
                    if(this.isMultiple) {
                        _obj = val;
                        // 子组件向父组件传递的方法和参数
                        _this.$emit("change-data", _obj);
                    }else {
                        // 调用获取options方法 防止异步请求时间过长的问题
                        _this.getOptions(function(data) {
                            // console.log(data);
                            _obj = data.find(function(item) {
                                return item.value === val;
                            });
                            // console.log(_obj);
                            // 子组件向父组件传递的方法和参数
                            _this.$emit("change-data", _obj);
                        });
                    }
                }else {
                    _obj.value = val;
                    // 子组件向父组件传递的方法和参数
                    _this.$emit("change-data", _obj);
                }
            }else {
                _this.$emit("change-data", _obj);
            }
        },
        // 级联下拉框方法
        setValue(val) {
            // console.log(val);
            if(this.isMultiple) {
                // console.log(val);
                // console.log(typeof val);
                // var setVal = val.split(",");
                this.value = val;
            }else {
                this.value = val;
            }
        },
        // 级联改变url
        setUrl(_json) {
            // 获取更新url
            this.url = _json.url;
            // 获取更新key-value
            this.key = _json.key;
            // 更新options
            this.getOptions();
        },
        // 禁用
        setDisabled(bool) {
            this.isDisabled = bool;
        },
        // 级联改变键值集合查询参数
        setParam(param) {
            this.params = param;
        },
        // 获取options
        getOptions(callback) {
            // 保存this指针
            var that = this;
            // 获取配置value-label
            var key_set;
            that.key == "" ? key_set = "" : key_set = JSON.parse(that.key);
            // 调用接口获取options
            if(that.url != "" && that.key != "") {
                $.ajax({
                    url:this.url,
                    type:"get",
                    data: this.params,
                    dataType:"json",
                    success:function(res) {
                        if(res.resp.respCode == "000") {
                            if(res.resp.content.state == "1") {
                                var _jsonObj = res.resp.content.data;
                                // 键值集合-有条件数据库表查询 数据结构判断
                                _jsonObj.data != undefined ? _jsonObj = _jsonObj.data : _jsonObj = _jsonObj;
                                // 无条件数据库表查询 数据结构判断
                                _jsonObj.result != undefined ? _jsonObj = _jsonObj.result : _jsonObj = _jsonObj;
                                // 循环配置value-label
                                if(key_set != "") {
                                    for(var i = 0;i < _jsonObj.length;i++) {
                                        _jsonObj[i].value = _jsonObj[i][key_set.value];
                                        _jsonObj[i].label = _jsonObj[i][key_set.label];
                                    }
                                }
                                // 赋值options
                                that.options = _jsonObj;
                                // console.log(that.options);
                                if(callback) {
                                    callback(_jsonObj);
                                }
                            }
                        }
                    },
                    error:function() {
                        alert("错误");
                    }
                });
            }
        },
        // 下拉框隐藏时回调
        expanded(bool) {
            var data = this.options;
            var value = this.value;
            var _name = this.name;
            if(!bool) {
                if(this.isMultiple) {
                    for(var i = 0;i < data.length;i++) {
                        for(var j = 0;j < value.length;j++) {
                            if(data[i].value == value[j]) {
                                _name.push(data[i].label);
                            }
                        }
                    }
                }else {
                    for(var i = 0;i < data.length;i++) {
                        if(data[i].value == value) {
                            _name = data[i].label;
                        }
                    }
                }
                this.$emit("hide", _name);
            }
        }
    },
    mounted() {
        // 获取初始默认值
        if(this.initial.value == "" || this.initial.value == undefined) {
            this.value = []
        }else {
            this.value = this.initial.value;
        }

        // 获取禁用标记
        if(!this.initial.disabled || this.initial.disabled == "" || this.initial.disabled == undefined) {
            this.isDisabled = false;
        }else {
            this.isDisabled = true;
        }

        // 获取多选配置
        if(!this.initial.multiple || this.initial.multiple == "" || this.initial.multiple == undefined) {
            this.isMultiple = false;
        }else {
            this.isMultiple = true;
        }

        // 获取options的url
        if(this.initial.url) {
            this.url = this.initial.url;
            this.params = {
                search:"",
                pageSize:"",
                pageNum:""
            }
        }else if(this.initial.params) {
            // 键值集合
            this.url = serverPath + "/keySet/queryKeyCode";
            this.params = {
                keyCode: this.initial.params
            };
        }

        // 获取配置label-value
        this.initial.key == undefined ? this.key = '{"value": "confKey", "label": "confValue"}' : this.key = this.initial.key;

        // 获取下拉框options
        this.getOptions();
    },
    updated: function () {
        //
    },
    template: `<el-select @change="changeSelect" @visible-change="expanded" v-model="value" :multiple="isMultiple" :disabled="isDisabled" clearable="true" placeholder="请选择">
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
    // 设置参数
    props: ["initial"],
    data() {
        return {
            value: [],  // 下拉框选中绑定值
            isDisabled: false,  // 下拉框是否禁用
            options: [],    // 下拉框option
            url: "",    // 获取option接口
            params: {}  // 调用接口参数
        };
    },
    methods: {
        changeSelect() {
            // 子组件向父组件传递的方法和参数
            this.$emit("change-datas", this.value);
        },
        getOptions() {
            // 保存this指针
            var that = this;
            // 获取配置value-label
            var key_set;
            this.initial.key == undefined ? key_set = "" : key_set = JSON.parse(this.initial.key);
            // 调用接口获取options
            if(this.url != "") {
                $.ajax({
                    url:this.url,
                    type:"get",
                    data: this.params,
                    dataType:"json",
                    success:function(res){
                        if(res.resp.respCode == "000"){
                            if(res.resp.content.state == "1"){
                                var _jsonObj = res.resp.content.data;
                                // 键值集合-有条件数据库表查询 数据结构判断
                                _jsonObj.data != undefined ? _jsonObj = _jsonObj.data : _jsonObj = _jsonObj;
                                // 无条件数据库表查询 数据结构判断
                                _jsonObj.result != undefined ? _jsonObj = _jsonObj.result : _jsonObj = _jsonObj;
                                // 循环配置value-label
                                if(key_set != "") {
                                    for(var i = 0;i < _jsonObj.length;i++) {
                                        _jsonObj[i].value = _jsonObj[i][key_set.value];
                                        _jsonObj[i].label = _jsonObj[i][key_set.label];
                                    }
                                }
                                // 赋值options
                                that.options = _jsonObj;
                                // console.log(that.options);
                            }
                        }
                    },
                    error:function(){
                        alert("错误");
                    }
                });
            }
        }
    },
    mounted() {
        // 获取初始默认值
        if(this.initial.value == "" || this.initial.value == undefined) {
            this.value = []
        }else {
            this.value = this.initial.value;
        }

        // 获取禁用标记
        if(this.initial.disabled == "false" || this.initial.disabled == "" || this.initial.disabled == undefined) {
            this.isDisabled = false;
        }else {
            this.isDisabled = true;
        }

        // 获取options的url
        if(this.initial.url) {
            this.url = this.initial.url;
            this.params = {
                search:"",
                pageSize:"",
                pageNum:""
            }
        }else if(this.initial.params) {
            // 键值集合
            this.url = serverPath + "";
            this.params = this.initial.params;
        }

        // 调用接口获取options
        this.getOptions();
    },
    template: `<el-select @change="changeSelect" v-model="value" multiple :disabled="isDisabled" placeholder="请选择">
					<el-option
						v-for="item in options"
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
    // props: ["isFilter", "defaultExpandedKeys", "defaultCheckedKeys"],
    props: ["initial"],
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    data() {
        return {
            // 点击行展开节点
            clickToExpand: false,
            // 是否显示复选框
            checkbox: false,
            // 父子节点级联
            strictly: true,
            // 是否可过滤
            isFilter: false,
            // 过滤文本
            filterText: "",
            // 默认展开的节点
            defaultExpandedKeys: [],
            // 默认选中的节点
            defaultCheckedKeys: [],
            // 展开所有节点
            expandedAll: false,
            // 获取树数据接口
            url: "",
            // 接口参数
            params: "",
            // 树数据
            treeNodes: [],
            // 配置选项
            defaultProps: {
                children: 'children'
            },
            // 树节点 key
            key: "",
            // 当前选中节点
            currentCheckedNodes: [],
            // 加载状态图标
            loading: true,
            // 树结构边框
            hasBorder: true,
            // 过滤器显示清空按钮
            clearable: true
        }
    },
    beforeMount() {
        // 获取复选框显示配置
        if(this.initial.checkbox) {
            this.checkbox = true;
        }else {
            this.checkbox = false;
        }
        // 获取点击行展开节点配置
        if(this.initial.clickToExpand) {
            this.clickToExpand = this.initial.clickToExpand;
        }else {
            this.clickToExpand = false;
        }
        // 获取配置接口
        if(this.initial.url) {
            this.url = this.initial.url;
        }else {
            this.url = "";
        }
        // 获取树结构参数
        if(this.initial.params) {
            this.params = 'search=["' + this.initial.params + '"]';
        }else {
            this.params = "";
        }
        // 获取配置过滤Boolean值
        if(this.initial.filter) {
            this.isFilter = true;
        }else {
            this.isFilter = false;
        }
        // 获取配置树节点 key
        if(this.initial.defaultProps.key) {
            this.key = this.initial.defaultProps.key;
        }else {
            this.key = "";
        }
        // 获取defaultProps
        if(this.initial.defaultProps && this.initial.defaultProps.label) {
            this.defaultProps.label = this.initial.defaultProps.label;
            // 配置信息 key 父节点信息
            var _key = this.initial.defaultProps.key;
            var _parent = this.initial.defaultProps.parent;
            this.defaultProps.disabled = function(data, node) {
                // console.log(data);
                // console.log(node);
                if(data[_key] == "ROOT" && data[_parent] == "") {
                    return node.disabled = true;
                }
            }
        }else {
            this.defaultProps = {
                children: 'children'
            };
        }
        // 下拉框展开 获取是否展开所有节点配置
        if(this.initial.expandedAll) {
            this.expandedAll = this.initial.expandedAll;
        }else {
            this.expandedAll = false;
        }
        // 父子节点严格级联
        if(this.initial.strictly) {
            this.strictly = this.initial.strictly;
        }else {
            this.strictly = true;
        }
        // 获取配置信息树结构边框
        if(this.initial.border) {
            this.hasBorder = !this.initial.border;
        }else {
            this.hasBorder = true;
        }
    },
    mounted() {
        var self = this;
        // 获取配置信息
        var key = this.initial.defaultProps.key;
        var parent = this.initial.defaultProps.parent;
        // 调用接口获取树节点
        this.getNode(function(data) {
            // 展开项配置
            var _expanded = self.initial.expanded;
            // 选中项配置
            var checkedKey = self.initial.checked;
            // 复选框配置
            var checkbox = self.initial.checkbox;
            // 选中节点数据
            // var checkedData = self.currentCheckedNodes;
            // 若指定默认选中项
            if(checkedKey && checkedKey.length > 0) {
                // 如果显示复选框
                if(checkbox) {
                    // 设置选中项
                    self.setCheckedKeys(checkedKey);
                    // for(var i = 0;i < data.length;i++) {
                    //     for(var j = 0;j < checkedKey.length;j++) {
                    //         if(data[i][key] == checkedKey[j]) {
                    //             // 获取当前选中节点
                    //             checkedData.push(data[i]);
                    //         }
                    //     }
                    // }
                }else {}
            }else {
                // 若不配置选中项
                var defaultChecked;
                if(parent) {
                    // 层级关系树 默认选中根节点
                    for(var k = 0;k < data.length;k++) {
                        if(data[k][parent] == "") {
                            defaultChecked = data[k][key];
                        }
                    }
                }else {
                    // 一级树默认选中第一项
                    defaultChecked = data[0][key];
                }

                if(defaultChecked) {
                    self.setCheckedKeys([defaultChecked]);
                }
            }
            // 获取默认展开节点
            if(_expanded && _expanded.length > 0) {
                self.defaultExpandedKeys = JSON.parse(JSON.stringify(self.initial.expanded));
            }else {
                self.defaultExpandedKeys = [];
            }
        });
        // 取消过滤框按钮
        if(this.initial.filter) {
            this.removeClass("el-icon-search")
        }
    },
    methods: {
        // 点击节点 返回该节点对应的对象 对应的节点 节点本身
        clickNode(obj, node, row) {
            // 配置信息
            var label = this.defaultProps.label;
            var _id = this.initial.defaultProps.key;
            // 向父组件传递数据
            this.$emit("click-node", obj, obj[_id], obj[label]);
        },
        // 选择复选框 返回节点对应的对象 是否被选中 是否含有子节点
        checkNode(obj, checked, node) {
            var label = this.defaultProps.label;
            var _id = this.initial.defaultProps.key;
            // 返回数据增加节点选择标识
            var flag = checked;
            // 当前树选中节点集合
            var currentSelect = this.$refs.tree.getCheckedKeys();
            // 向父组件传递数据
            this.$emit("checked-node", obj, obj[_id], currentSelect, obj[label], flag);
        },
        // 过滤数据
        filterNode(value, data) {
            var label = this.initial.defaultProps.label;
            if (!value) return true;
            return data[label].indexOf(value) !== -1;
        },
        // 组织层级关系数据
        hierarchicalData(jsonArr) {
            // 组织数据
            var data = [];
            // 根节点下二级节点数组
            var nodes = [];
            // 获取配置信息
            var parent = this.initial.defaultProps.parent;
            var self = this.initial.defaultProps.key;
            // 若指定父节点信息 遍历原数组
            if(parent) {
                for(var i = 0; i < jsonArr.length; i++) {
                    // 向每一个json数组对象下添加 children 属性值
                    jsonArr[i].children = [];
                    // 若当前json对象没有父节点信息 说明其为根节点
                    if(jsonArr[i][parent] == "" && jsonArr[i][self] == "ROOT") {
                        // 将当前节点 push 到数据 data 中
                        data.push(jsonArr[i]);
                    }
                }
                // 循环遍历除根节点之外的数据
                for(var i = 0; i < jsonArr.length; i++) {
                    // 向每一个json数组对象下添加 children 属性值
                    jsonArr[i].children = [];
                    // 若当前json对象下有父节点信息 且为子级根节点
                    if(jsonArr[i][parent] != "") {
                        // 遍历查找json数组里符合该父节点信息的所有对象 并将其添加到父节点的 children 树形下
                        for(var j = 0;j < jsonArr.length;j++) {
                            if(jsonArr[j][parent] == jsonArr[i][self]) {
                                jsonArr[i].children.push(jsonArr[j]);
                            }
                        }
                    }
                    // 当前节点为一级根节点
                    if(jsonArr[i][parent] == "ROOT") {
                        // 将其子节点 push 到 children 下
                        nodes.push(jsonArr[i]);
                    }
                }
                // 将一级根节点插入根节点下
                data[0].children = nodes;
            }else {
                // 如果没指定父节点信息 当前节点信息 说明当前树结构是一级树
                data = jsonArr;
            }
            // console.log(data);
            return data;
        },
        // 调接口获取数据
        getNode(callback) {
            // 保存this指针
            var that = this;
            // 调用接口获取树节点
            if(that.url != "") {
                $.ajax({
                    url: this.url,
                    type: "get",
                    data: this.params,
                    dataType: "json",
                    success: function(res) {
                        if(res.resp.respCode == "000"){
                            if(res.resp.content.state == "1") {
                                var _jsonObj = res.resp.content.data.result;
                                // 专门查keySet的数据
                                if(!_jsonObj) {
                                    var newData = res.resp.content.data;
                                    var resArr = JSON.parse(newData);
                                    _jsonObj = resArr[that.initial.params];
                                }
                                // 节点数据赋值
                                that.treeNodes = that.hierarchicalData(_jsonObj);
                                // loading消失
                                that.loading = false;
                                // console.log(_jsonObj);
                                // console.log(that.treeNodes);
                                // 回调
                                if(callback) {
                                    callback(_jsonObj);
                                }
                            }
                        }
                    },
                    error: function() {
                        // loading消失
                        that.loading = false;
                        // 弹出错误信息
                        gmpPopup.throwMsg("查询失败！");
                    }
                });
            }
        },
        // 设置选择项
        setCheckedKeys(keys) {
            this.$refs.tree.setCheckedKeys(keys);
        },
        // 获取选中节点
        loadData(callback) {
            // 回掉函数
            if(callback) {
                callback(this.currentCheckedNodes);
            }
            // 刷新树结构
            this.getNode();
        },
        // 添加className
        addClass(name) {
            var targetElement = this.$el.firstChild.children[0].className;
            var newStr = targetElement + " " + name;
            this.$el.firstChild.children[0].className = newStr;
        },
        // 移除className
        removeClass(name) {
            var optionElement = this.$el.firstChild.children[0].className;
            var newClass = optionElement.replace(name, "");
            this.$el.firstChild.children[0].className = newClass;
        },
        // className查找
        hasClass(name) {
            var currentClass = this.$el.firstChild.children[0].className;
            var foundClass = currentClass.indexOf(name);
            if(foundClass > 0) {
                return true;
            }
            if(foundClass < 0) {
                return false;
            }
        },
        // 鼠标移入事件
        enter() {
            if(this.filterText != "" && this.clearable) {
                // addClass
                this.addClass("el-icon-circle-close");
            }
        },
        // 鼠标移出事件
        out() {
            if(this.filterText != "" && this.clearable) {
                // removeClass
                this.removeClass("el-icon-circle-close");
            }
        },
        // 清除选择内容事件
        clear(ev) {
            var isClose = this.hasClass("el-icon-circle-close");
            // 若当前图标为关闭图标
            if(isClose && this.clearable) {
                // 阻止事件冒泡
                ev.stopPropagation();
                // 清空输入内容
                this.filterText = "";
                // 移除class
                this.removeClass("el-icon-circle-close");
            }
        }
    },
    template: `<div>
                    <el-input placeholder="输入关键字进行过滤" v-model="filterText" v-show="isFilter" icon="search" @mouseover.native="enter" @mouseout.native="out" :on-icon-click="clear" style="margin-bottom: 5px;"></el-input>
                    <el-tree v-loading.body="loading" element-loading-text="拼命加载中" :expand-on-click-node="clickToExpand" :class="{treeBorder: hasBorder}" :check-strictly="strictly" :data="treeNodes" :show-checkbox="checkbox" @node-click="clickNode" @check-change="checkNode" :default-expanded-keys="defaultExpandedKeys" :default-expand-all="expandedAll" :node-key="key" ref="tree" highlight-current :props="defaultProps" :filter-node-method="filterNode">
                    </el-tree>
                </div>`
});

/**
 * @description:树形下拉框
 * @author:liyuanquan
 */
Vue.component("select-tree", {
    // 用户配置信息
    props: ["initial"],
    data() {
        return {
            // 点击行展开节点
            clickToExpand: false,
            // 显示过滤器
            isFilter: false,
            // 过滤文本
            filterText: "",
            // 获取树节点接口
            url: "",
            // 树节点数据
            treeNodes: [],
            // 节点 key
            key: "",
            // 选中的节点名称
            select_node: [],
            // 选中节点 id
            select_id: [],
            // 选择行数据
            getClickNode: "",
            // 是否显示复选框
            checkbox: "",
            // 中间参数
            middle: [],
            // 默认展开节点
            defaultExpandedKeys: [],
            // 展开所有节点
            expandedAll: false,
            // 默认选中节点 -- 仅当 checkbox 为true时
            defaultCheckedKeys: [],
            // 默认配置信息
            defaultProps: {
                children: 'children'
            },
            // 是否显示清空图标
            clearable: true,
            // 加载
            loading: true,
            // 配置信息错误 获取数据失败
            error: true,
            // 下拉框宽度
            dropWidth: "",
            // 接收配置信息的中间变量
            sycnData: ""
        }
    },
    watch: {
        filterText(val) {
            this.$refs.selectTree.filter(val);
        },
        sycnData: function(val, oldVal) {
            // console.log(val);
            // console.log(oldVal);

            // var self = this;
            // // 获取树节点数据
            // this.getNode(function(data) {
            //     // 获取配置信息默认选择项
            //     var _checked = val.checked;
            //     // 获取配置信息显示名称
            //     var _name = val.defaultProps.label;
            //     var _key = val.defaultProps.key;
            //     // 配置信息复选框
            //     var _checkbox = val.checkbox;
            //     // 选择节点信息
            //     var _selectNode = [];
            //     // 若配置信息中含有默认选择项
            //     if(_checked && _checked.length > 0 && _checkbox) {
            //         // 遍历后端数据
            //         for(var i = 0;i < data.length;i++) {
            //             // 后端数据中 id为配置id的项 push到数组中
            //             for(var j = 0;j < _checked.length;j++) {
            //                 if(data[i][_key] == _checked[j]) {
            //                     _selectNode.push(data[i][_name]);
            //                 }
            //             }
            //         }
            //         // 显示选中项名称
            //         self.select_node = _selectNode;
            //     }else if(_checked && _checked.length > 0 && !_checkbox) {
            //         // 若不显示复选框 设置选中多节点 默认选中第一个配置节点
            //         for(var i = 0;i < data.length;i++) {
            //             // 后端数据中 id为配置id的项 push到数组中
            //             if(data[i].rowId == _checked) {
            //                 _selectNode.push(data[i][_name]);
            //             }
            //         }
            //         self.select_node = _selectNode;
            //         self.middle = _selectNode;
            //     }
            // });
        },
        defaultCheckedKeys(val, oldVal) {
            // console.log(val);
            // console.log(oldVal);
            var that = this;
            // 获取树节点数据
            this.getNode(function(data) {
                // 获取配置信息默认选择项
                var _checked = [];
                // 获取选中节点
                if(typeof val == "string") {
                    _checked.push(val);
                }else {
                    _checked = val;
                }
                // 获取配置信息显示名称
                var _name = that.initial.defaultProps.label;
                var _key = that.initial.defaultProps.key;
                // 配置信息复选框
                var _checkbox = that.checkbox;
                // 选择节点信息
                var _selectNode = [];
                // 若配置信息中含有默认选择项
                if(_checked && _checked.length > 0 && _checkbox) {
                    // 遍历后端数据
                    for(var i = 0;i < data.length;i++) {
                        // 后端数据中 id为配置id的项 push到数组中
                        for(var j = 0;j < _checked.length;j++) {
                            if(data[i].rowId == _checked[j] || data[i][_key] == _checked[0]) {
                                _selectNode.push(data[i][_name]);
                            }
                        }
                    }
                    // 显示选中项名称
                    that.select_node = _selectNode;
                }else if(_checked && _checked.length > 0 && !_checkbox) {
                    // 若不显示复选框 设置选中多节点 默认选中第一个配置节点
                    for(var i = 0;i < data.length;i++) {
                        // 后端数据中 id为配置id的项 push到数组中
                        if(data[i].rowId == _checked[0] || data[i][_key] == _checked[0]) {
                            _selectNode.push(data[i][_name]);
                        }
                    }
                    that.select_node = _selectNode;
                    that.middle = _selectNode;
                }
            });
        }
    },
    methods: {
        // 点击节点 返回该节点对应的对象 对应的节点 节点本身
        clickNode(obj, node, row) {
            var label = this.defaultProps.label;
            var parent = this.initial.defaultProps.parent;
            var id = this.initial.defaultProps.key;
            // console.log(obj);
            // console.log(node);
            // console.log(row);

            // 若为根节点 确认按钮不可用
            if(obj[id] == "ROOT" && obj[parent] == "") {
                // 确认按钮不可用
                this.error = true;
            }else {
                // 节点数据
                this.getClickNode = obj;
                // console.log(this.getClickNode);
                // 选中的节点名称
                this.middle = obj[label];
                // 选中节点 id
                this.select_id = obj[id];
                // 确认按钮可用
                this.error = false;
                // 向父组件传递方法和数据
                this.$emit("click-node", obj, obj[id], obj[label]);
            }
        },
        // 选择复选框 返回节点对应的对象 是否被选中 节点的子树中是否有被选中的节点
        checkNode(obj, checked, node) {
            var label = this.defaultProps.label;
            var _id = this.initial.defaultProps.key;
            // 返回数据增加节点选择标识
            var flag = checked;
            // console.log(obj);
            // console.log(checked);
            // console.log(node);
            // 选中的节点名称
            if(!checked) {
                // 取消选中项 输入框删除相应内容
                var target = this.select_node;
                // this.select_node = [];
                for(var k = 0;k < target.length;k++) {
                    // 若节点名称为当前点击节点名称
                    if(obj[label] == target[k]) {
                        var _index = target.indexOf(target[k]);
                        target.splice(_index, 1);
                    }
                }
            }
            // 选中节点 id
            this.select_id = obj[_id];
            // 确认按钮状态 获取当前树选择节点
            var currentSelect = this.$refs.selectTree.getCheckedKeys();
            // 返回数组长度不为零 确认按钮可用
            if(currentSelect.length > 0) {
                this.error = false;
            }else {
                this.error = true;
            }
            // 向父组件传递方法和数据
            this.$emit("checked-node", obj, obj[_id], currentSelect, obj[label], flag);
        },
        // 过滤数据
        filterNode(value, data) {
            var label = this.initial.defaultProps.label;
            if (!value) return true;
            return data[label].indexOf(value) !== -1;
        },
        // 选中节点事件
        checked() {
            // 若显示复选框
            if(this.checkbox) {
                // 获取配置信息 label
                var label = this.initial.defaultProps.label;
                // 获取当前选中节点
                var checkedNodes = this.$refs.selectTree.getCheckedNodes();
                // 节点名称数组
                var nodesName = [];
                // 循环遍历选中节点
                for(var g = 0;g < checkedNodes.length;g++) {
                    // 将节点名称push到数组中
                    nodesName.push(checkedNodes[g][label]);
                }
                // 改变选中节点key为当前选中节点key
                this.select_id = this.$refs.selectTree.getCheckedKeys();
                // 显示节点名称
                this.select_node = nodesName;
                // 点击确认后传递当前选择id
                this.$emit("select-node", this.select_id);
            }else {
                // 若不显示复选框
                this.select_node = this.middle;
                // 点击确认后传递当前选择id
                this.$emit("select-node", this.getClickNode, this.select_node);
            }
        },
        // 添加className
        addClass(_obj, name) {
            var targetElement,
                newStr;
            // 对象判断
            if(_obj == this) {
                targetElement = _obj.$el.firstChild.children[0].className;
                // 拼接className字符串
                newStr = targetElement + " " + name;
                // 目标对象赋值
                _obj.$el.firstChild.children[0].className = newStr;
            }else {
                targetElement = _obj.$el.children[0].className;
                // 拼接className字符串
                newStr = targetElement + " " + name;
                // 目标对象赋值
                _obj.$el.children[0].className = newStr;
            }
        },
        // 移除className
        removeClass(_obj, name) {
            var optionElement,
                _remove_index,
                newClass;
            if(_obj == this) {
                // 目标对象className
                optionElement = _obj.$el.firstChild.children[0].className;
                // 字符串转成数组
                var arr = optionElement.split(" ");
                // 循环遍历当前数组
                for(var i = 0;i < arr.length;i++) {
                    if(arr[i] == name) {
                        // 审查当前className数组是否含有传入值
                        _remove_index = arr.indexOf(name);
                        if(_remove_index > 0) {
                            // 若存在将传入值从className数组中移除
                            arr.splice(_remove_index, 1);
                            // 数组转为字符串
                            newClass = arr.toString();
                            // 空格代替逗号
                            for(var j = 0;j < arr.length;j++) {
                                newClass = newClass.replace(",", " ");
                            }
                        }
                    }else {
                        // 若传入值不存在于className数组中 直接返回className数组
                        newClass = arr.toString();
                        newClass = newClass.replace(",", " ");
                    }
                }
                // 将新值赋予目标元素class
                _obj.$el.firstChild.children[0].className = newClass;
            }else {
                // 目标对象className
                optionElement = _obj.$el.children[0].className;
                // 字符串转成数组
                var arr = optionElement.split(" ");
                // 循环遍历当前数组
                for(var i = 0;i < arr.length;i++) {
                    if(arr[i] == name) {
                        // 审查当前className数组是否含有传入值
                        _remove_index = arr.indexOf(name);
                        if(_remove_index > 0) {
                            // 若存在将传入值从className数组中移除
                            arr.splice(_remove_index, 1);
                            // 数组转为字符串
                            newClass = arr.toString();
                            // 空格代替逗号
                            for(var j = 0;j < arr.length;j++) {
                                newClass = newClass.replace(",", " ");
                            }
                        }
                    }else {
                        // 若传入值不存在于className数组中 直接返回className数组
                        newClass = arr.toString();
                        newClass = newClass.replace(",", " ");
                    }
                }
                // 将新值赋予目标元素class
                _obj.$el.children[0].className = newClass;
            }
        },
        // className查找
        hasClass(_obj, name) {
            var currentClass;
            // 传入对象判断
            if(_obj == this) {
                currentClass = _obj.$el.firstChild.children[0].className;
            }else {
                currentClass = _obj.$el.children[0].className;
            }
            // 检查当前className是否含有传入值
            var foundClass = currentClass.indexOf(name);
            if(foundClass > 0) {
                return true;
            }
            if(foundClass < 0) {
                return false;
            }
        },
        // 鼠标移入事件
        enter() {
            var optionSelectTree = this.$el.className;
            // 目标索引判断
            var _index = optionSelectTree.indexOf("current__select");
            if(_index < 0) {
                // 当前对象添加className
                this.$el.className = optionSelectTree + " " + "current__select";
            }
            // 若输入框值为空并且配置清空按钮
            if(this.select_node != "" && this.clearable) {
                // addClass
                this.addClass(this, "el-icon-circle-close");
            }
        },
        // 鼠标移出事件
        out() {
            if(this.select_node != "" && this.clearable) {
                // removeClass
                this.removeClass(this, "el-icon-circle-close");
            }
        },
        // 清除选择内容事件
        clear(ev) {
            var isClose = this.hasClass(this, "el-icon-circle-close");
            // 若当前图标为关闭图标
            if(isClose && this.clearable) {
                // 阻止事件冒泡
                ev.stopPropagation();
                // 清空选中项名称
                this.select_node = "";
                // 清空选中项id
                this.select_id = "";
                // 清除选择项 仅当复选框配置的情况下
                if(this.checkbox) {
                    this.setCheckedKeys([]);
                }
                // 传递清空后数据
                this.$emit("clear", this.select_id, this.select_node);
                // 移除class
                this.removeClass(this, "el-icon-circle-close");
            }
        },
        // 过滤器输入框鼠标移入事件
        filter_enter() {
            if(this.filterText != "" && this.clearable) {
                // addClass
                this.addClass(this.$refs.filter, "el-icon-circle-close");
            }
        },
        // 过滤器输入框鼠标移出事件
        filter_out() {
            if(this.filterText != "" && this.clearable) {
                // removeClass
                this.removeClass(this.$refs.filter, "el-icon-circle-close");
            }
        },
        // 过滤器输入框清除选择内容事件
        filter_clear(ev) {
            // 判断当前输入框icon是否是关闭按钮
            var isClose = this.hasClass(this.$refs.filter, "el-icon-circle-close");
            // 若当前图标为关闭图标
            if(isClose && this.clearable) {
                // 阻止事件冒泡
                ev.stopPropagation();
                // 清空输入内容
                this.filterText = "";
                // 移除class
                this.removeClass(this.$refs.filter, "el-icon-circle-close");
            }
        },
        // 点击过滤输入框阻止事件冒泡
        stopPropa(ev) {
            // 阻止事件冒泡
            ev.stopPropagation();
        },
        // 下拉框展开事件
        expanded(bool) {
            // 当前选择节点信息
            var _select = this.select_node;
            // 配置信息checkbox
            var _checkbox = this.initial.checkbox;
            // bool = true 为展开  bool = false 为收缩
            if(bool) {
                // input添加类 然图标翻转
                this.addClass(this, "is-reverse");
                // 移除过滤器图标
                if(this.initial.filter) {
                    this.removeClass(this.$refs.filter, "el-icon-search");
                }
            }else if(!bool) {
                this.removeClass(this, "is-reverse");
            }

            if(bool && this.clearable && _checkbox) {
                // 获取配置展开项 选择项
                var _expanded = this.initial.expanded;
                var _checked = this.select_id;
                // 下拉框展开 树结构展开配置节点
                if(_expanded && _expanded.length > 0) {
                    this.defaultExpandedKeys = this.initial.expanded;
                }else {
                    this.defaultExpandedKeys = [];
                }
                // 下拉框展开 树结构选中配置节点
                if(_checked && _checked.length > 0 &&  _select.length > 0) {
                    // this.defaultCheckedKeys = this.initial.checked;
                    this.setCheckedKeys(_checked);
                    // 确认按钮可用
                    this.error = false;
                }else {
                    this.defaultCheckedKeys = [];
                    // 确认按钮不可用
                    this.error = true;
                }
            }else if(!bool && this.clearable && _checkbox) {
                // 若选中节点没有确认
                if(_select.length == 0) {
                    // 收缩下拉框 清空选中项
                    this.setCheckedKeys([]);
                    // 确认按钮不可用
                    this.error = true;
                }
            }else if(!this.clearable) {
                // 如果配置不显示关闭图标
                var _expanded = this.initial.expanded;
                var _checked = this.initial.checked;
                // 下拉框展开 树结构展开配置节点
                if(_expanded && _expanded.length > 0) {
                    this.defaultExpandedKeys = this.initial.expanded;
                }else {
                    this.defaultExpandedKeys = [];
                }
                // 下拉框展开 树结构选中配置节点
                if(_checked && _checked.length > 0) {
                    // this.defaultCheckedKeys = this.initial.checked;
                    this.setCheckedKeys(JSON.parse(JSON.stringify(this.initial.checked)));
                    // 确认按钮可用
                    this.error = false;
                }else {
                    this.defaultCheckedKeys = [];
                    // 确认按钮不可用
                    this.error = true;
                }
            }else if(!_checkbox && bool) {
                // 配置不显示复选框 下拉框显示时
                this.error = false;
                // input添加类 然图标翻转
                $("#gmpDrop .el-input").find('.el-input__icon').addClass('is-reverse');
            }else if(!_checkbox && !bool) {
                // 配置不显示复选框 下拉框隐藏时
                $("#gmpDrop .el-input").find('.el-input__icon').removeClass('is-reverse');
            }
        },
        // 组织层级关系数据
        hierarchicalData(jsonArr) {
            // 组织数据
            var data = [];
            // 根节点下二级节点数组
            var nodes = [];
            // 获取配置信息
            var parent = this.initial.defaultProps.parent;
            var self = this.initial.defaultProps.key;
            // 若指定父节点信息 遍历原数组
            if(parent) {
                for(var i = 0; i < jsonArr.length; i++) {
                    // 向每一个json数组对象下添加 children 属性值
                    jsonArr[i].children = [];
                    // 若当前json对象没有父节点信息 说明其为根节点
                    if(jsonArr[i][parent] == "" && jsonArr[i][self] == "ROOT") {
                        // 将当前节点 push 到数据 data 中
                        data.push(jsonArr[i]);
                    }
                }
                // 循环遍历除根节点之外的数据
                for(var i = 0; i < jsonArr.length; i++) {
                    // 向每一个json数组对象下添加 children 属性值
                    jsonArr[i].children = [];
                    // 若当前json对象下有父节点信息 且为子级根节点
                    if(jsonArr[i][parent] != "") {
                        // 遍历查找json数组里符合该父节点信息的所有对象 并将其添加到父节点的 children 树形下
                        for(var j = 0;j < jsonArr.length;j++) {
                            if(jsonArr[j][parent] == jsonArr[i][self]) {
                                jsonArr[i].children.push(jsonArr[j]);
                            }
                        }
                    }
                    // 当前节点为一级根节点
                    if(jsonArr[i][parent] == "ROOT") {
                        // 将其子节点 push 到 children 下
                        nodes.push(jsonArr[i]);
                    }
                }
                // 将一级根节点插入根节点下
                data[0].children = nodes;
            }else {
                // 如果没指定父节点信息 当前节点信息 说明当前树结构是一级树
                data = jsonArr;
            }
            // console.log(data);
            return data;
        },
        // 调接口获取树形下拉框节点数据
        getNode(callback) {
            // 保存this指针
            var that = this;
            // 调用接口获取树节点
            if(that.url != "") {
                $.ajax({
                    url:this.url,
                    type:"get",
                    data: "",
                    dataType:"json",
                    success:function(res) {
                        if(res.resp.respCode == "000"){
                            if(res.resp.content.state == "1") {
                                var _jsonObj = res.resp.content.data.result;
                                // 节点数据赋值
                                that.treeNodes = that.hierarchicalData(_jsonObj);
                                // loading消失
                                that.loading = false;
                                // console.log(_jsonObj);
                                // console.log(that.treeNodes);
                                // 回调
                                if(callback) {
                                    callback(_jsonObj);
                                }
                            }
                        }
                    },
                    error:function() {
                        // loading消失
                        that.loading = false;
                        // 弹出错误信息
                        gmpPopup.throwMsg("查询失败！");
                    }
                });
            }
        },
        // 设置默认选中节点
        setCheckedKeys(keys) {
            this.$refs.selectTree.setCheckedKeys(keys);
        },
        // 设置下拉框宽度
        widthChange() {
            this.dropWidth = this.$refs.treeInput.$el.clientWidth - 2;
        }
    },
    beforeMount() {
        this.sycnData = this.initial;
        // 获取配置信息手否显示过滤器
        if(this.initial.filter) {
            this.isFilter = this.initial.filter;
        }else {
            this.isFilter = false;
        }
        // 获取点击行展开节点配置
        if(this.initial.clickToExpand) {
            this.clickToExpand = this.initial.clickToExpand;
        }else {
            this.clickToExpand = false;
        }
        // 获取复选框显示配置
        if(this.initial.checkbox) {
            this.checkbox = true;
        }else {
            this.checkbox = false;
        }
        // 获取配置接口
        if(this.initial.url) {
            this.url = this.initial.url;
        }else {
            this.url = "";
        }
        // 树节点 key
        if(this.initial.defaultProps.key) {
            this.key = this.initial.defaultProps.key;
        }else {
            this.key = "";
        }
        // 获取defaultProps
        if(this.initial.defaultProps && this.initial.defaultProps.label) {
            this.defaultProps.label = this.initial.defaultProps.label;
            // 配置信息 key 父节点信息
            var _key = this.initial.defaultProps.key;
            var _parent = this.initial.defaultProps.parent;
            this.defaultProps.disabled = function(data, node) {
                // console.log(data);
                // console.log(node);
                if(data[_key] == "ROOT" && data[_parent] == "") {
                    return node.disabled = true;
                }
            }
        }else {
            this.defaultProps = {
                children: 'children'
            };
            // 确认按钮不可用
            this.error = true;
        }
        // 获取配置是否显示清空内容图标
        if(this.initial.clearable) {
            this.clearable = this.initial.clearable;
        }else {
            this.clearable = true;
        }
        // 下拉框展开 获取是否展开所有节点配置
        if(this.initial.expandedAll) {
            this.expandedAll = this.initial.expandedAll;
        }else {
            this.expandedAll = false;
        }
        // 获取配置默认选择项
        if(this.initial.checked) {
            this.defaultCheckedKeys = this.initial.checked;
        }else {
            this.defaultCheckedKeys = [];
        }
    },
    mounted() {
        var self = this;
        // 获取树节点数据
        this.getNode(function(data) {
            // 获取配置信息默认选择项
            var _checked = self.defaultCheckedKeys;
            // 获取配置信息显示名称
            var _name = self.initial.defaultProps.label;
            var _key = self.initial.defaultProps.key;
            // 配置信息复选框
            var _checkbox = self.checkbox;
            // 选择节点信息
            var _selectNode = [];
            // 若配置信息中含有默认选择项
            if(_checked && _checked.length > 0 && _checkbox) {
                // 遍历后端数据
                for(var i = 0;i < data.length;i++) {
                    // 后端数据中 id为配置id的项 push到数组中
                    for(var j = 0;j < _checked.length;j++) {
                        if(data[i][_key] == _checked[j]) {
                            _selectNode.push(data[i][_name]);
                        }
                    }
                }
                // 显示选中项名称
                self.select_node = _selectNode;
            }else if(_checked && _checked.length > 0 && !_checkbox) {
                // 若不显示复选框 设置选中多节点 默认选中第一个配置节点
                for(var i = 0;i < data.length;i++) {
                    // 后端数据中 id为配置id的项 push到数组中
                    if(data[i][_key] == _checked[0]) {
                        _selectNode.push(data[i][_name]);
                    }
                }
                self.select_node = _selectNode;
                self.middle = _selectNode;
            }
        });
        // 实例创建完成 设置下拉框宽度;
        this.widthChange();
        // 监听窗口事件 下拉框宽度自适应
        window.addEventListener("resize", this.widthChange);
    },
    beforeUpdate() {
        var updatedChecked = this.initial.checked;
        if(updatedChecked && updatedChecked.length > 0) {
            this.defaultCheckedKeys = this.initial.checked;
        }
        // var self = this;
        // // 获取树节点数据
        // this.getNode(function(data) {
        //     // 获取配置信息默认选择项
        //     var _checked = self.initial.checked;
        //     // 获取配置信息显示名称
        //     var _name = self.initial.defaultProps.label;
        //     var _key = self.initial.defaultProps.key;
        //     // 配置信息复选框
        //     var _checkbox = self.checkbox;
        //     // 选择节点信息
        //     var _selectNode = [];
        //     // 若配置信息中含有默认选择项
        //     if(_checked && _checked.length > 0 && _checkbox) {
        //         // 遍历后端数据
        //         for(var i = 0;i < data.length;i++) {
        //             // 后端数据中 id为配置id的项 push到数组中
        //             for(var j = 0;j < _checked.length;j++) {
        //                 if(data[i][_key] == _checked[j]) {
        //                     _selectNode.push(data[i][_name]);
        //                 }
        //             }
        //         }
        //         // 显示选中项名称
        //         self.select_node = _selectNode;
        //     }else if(_checked && _checked.length > 0 && !_checkbox) {
        //         // 若不显示复选框 设置选中多节点 默认选中第一个配置节点
        //         for(var i = 0;i < data.length;i++) {
        //             // 后端数据中 id为配置id的项 push到数组中
        //             if(data[i][_key] == _checked[0]) {
        //                 _selectNode.push(data[i][_name]);
        //             }
        //         }
        //         self.select_node = _selectNode;
        //         self.middle = _selectNode;
        //     }
        // });
    },
    template: `<el-dropdown class="gmp_select_tree" trigger="click" @visible-change="expanded" style="width: 100%;">
                    <el-input v-model="select_node" :readonly="true" ref="treeInput" icon="caret-top" @mouseover.native="enter" @mouseout.native="out" :on-icon-click="clear" placeholder="请选择"></el-input>
                    <el-dropdown-menu slot="dropdown" class="gmp-dropdown-menu" :style="{width: dropWidth + 'px'}">
                        <el-dropdown-item>
                            <div style="max-height: 320px;width: 100%;overflow-y: scroll;">
                                <el-input placeholder="输入关键字进行过滤" ref="filter" v-model="filterText" v-show="isFilter" @click.native="stopPropa" @mouseover.native="filter_enter" @mouseout.native="filter_out" :on-icon-click="filter_clear" icon="search" style="padding: 0 5px;margin-bottom: 8px;" :style="{width: dropWidth - 10 + 'px'}"></el-input>
                                <el-tree :data="treeNodes" :show-checkbox="checkbox" :expand-on-click-node="clickToExpand" :check-strictly="true" @node-click="clickNode" @check-change="checkNode" :default-expanded-keys="defaultExpandedKeys" :default-expand-all="expandedAll" :node-key="key" ref="selectTree" highlight-current :props="defaultProps" :filter-node-method="filterNode"></el-tree>
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button size="mini" type="primary" icon="check" @click="checked" :disabled="error"></el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>`
});

/**
 * @description:时间选择器组件
 * @author:liyuanquan
 */
Vue.component("time-picker", {
    // 默认显示的时间  是否是时间段  是否可用  是否只读  时间格式化  是否可输入
    props: ["initialTime", "isRange", "isDisabled", "readOnly", "formatter", "editAble"],
    data() {
        return {
            value: []
        }
    },
    methods: {
        // 选择器值发生改变时 返回当前值
        currentVal(date) {
            // 如果change事件返回值为undefined 强制转为空
            date == undefined ? date = "" : date = date;
            // 将子组件返回值传递给父组件
            this.$emit("selected-time", date);
        }
    },
    template: `<el-time-picker v-model="value" @change="currentVal" :format="formatter" :is-range="isRange" :disabled="isDisabled" :readonly="readOnly" placeholder="选择时间" :editable="editAble">
                </el-time-picker>`
});

/**
 * @description:日期时间选择器组件
 * @author:liyuanquan
 */
Vue.component("date-time-picker", {
    // 控件类型(必选)  默认显示日期  快捷键选择值  输出格式化  是否只读  是否可用  是否禁用  是否可输入
    // props: ["pickerType", "initialDate", "pickerOptions", "formatter", "readOnly", "isDisabled", "editAble"],
    props: ["initial"],
    data() {
        return {
            // 选择日期时间值
            value: "",
            // 控件类型
            pickerType: "",
            // 日期时间格式化
            formatter: "",
            // 是否显示清除图标
            clearable: true,
            // 是否禁用
            disabled: false,
            // 是否只读
            readonly: false,
            // 是否可手动输入日期
            edit: false,
            // 操作配置项
            pickerOptions: "",
            // 占位符文字
            placeholder: "请选择日期时间"
        }
    },
    beforeMount() {
        // 获取配置项 -- 控件类型
        if(this.initial.type) {
            this.pickerType = this.initial.type;
        }else {
            this.pickerType = "date";
        }
        // 获取配置信息 -- 默认值
        if(this.initial.value) {
            this.value = this.initial.value;
        }
        // 获取配置信息 -- 日期时间格式化
        if(this.initial.formatter) {
            this.formatter = this.initial.formatter
        }else {
            this.formatter = "yyyy-MM-dd";
        }
        // 获取配置信息 -- 是否禁用
        if(this.initial.disabled) {
            this.disabled = this.initial.disabled;
        }
        // 获取配置信息 -- 是否只读
        if(this.initial.readonly) {
            this.readonly = this.initial.readonly;
        }
        // 获取配置信息 -- 是否可以首都输入日期
        if(this.initial.edit) {
            this.edit = this.initial.edit;
        }
        // 获取配置信息 -- 操作配置项
        if(this.initial.pickerOptions) {
            this.pickerOptions = this.initial.pickerOptions;
        }else {
            this.pickerOptions = "";
        }
        // 占位符文字配置
        if(this.initial.placeholder) {
            this.placeholder = this.initial.placeholder
        }
        // 清除图标配置
        if(this.initial.clearable) {
            this.clearable = this.initial.clearable;
        }
    },
    methods: {
        // 选择器值发生改变时 返回当前值
        datetimeVal(datetime) {
            // 如果change事件返回值为undefined 强制转为空
            datetime == undefined ? datetime = "" : datetime = datetime;
            // 将子组件返回值传递给父组件
            this.$emit("selected-datetime", datetime);
        }
    },
    template: `<el-date-picker @change="datetimeVal" v-model="value" :type="pickerType" :format="formatter" :placeholder="placeholder" :picker-options="pickerOptions" :readonly="readonly" :disabled="disabled" :editable="edit" :clearable="clearable" style="width: 100%;">
                </el-date-picker>`
});

/**
 * @description:级联选择组件
 * @author:liyuanquan
 */
Vue.component("cascader", {
    // 触发方式(点击或者滑过)  设置默认显示的值
    props: ["triggerType", "initialVal"],
    data() {
        return {
            options: [{
                value: "beijing",
                label: "北京市",
                children: [{
                    value: "chaoyang",
                    label: "朝阳区",
                    children: [{
                        value: "huixinxijie",
                        label: "惠新西街"
                    }]
                }, {
                    value: "haidian",
                    label: "海淀区"
                }, {
                    value: "dongcheng",
                    label: "东城区"
                }, {
                    value: "xicheng",
                    label: "西城区"
                }]
            }, {
                value: "shanghai",
                label: "上海市",
                children: [{
                    value: "baoshan",
                    label: "宝山区",
                    children: [{
                        value: "youyilu",
                        label: "友谊路"
                    }]
                }, {
                    value: "pudong",
                    label: "浦东新区"
                }, {
                    value: "jingan",
                    label: "静安区"
                }, {
                    value: "putuo",
                    label: "普陀区"
                }]
            }, {
                value: "liaoning",
                label: "辽宁省",
                children: [{
                    value: "shenyang",
                    label: "沈阳市"
                }, {
                    value: "dalian",
                    label: "大连市",
                    children: [{
                        value: "jinzhou",
                        label: "金州区"
                    }]
                }]
            }, {
                value: "guangxi",
                label: "广西壮族自治区",
                children: [{
                    value: "nanning",
                    label: "南宁市"
                }, {
                    value: "liuzhou",
                    label: "柳州市",
                    children: [{
                        value: "yufeng",
                        label: "鱼峰区"
                    }]
                }]
            }],
            selectedOptions: []
        }
    },
    methods: {
        handleChange(val) {
            // console.log(val);
            this.$emit("get-select", val);
        }
    },
    mounted() {
        // 接收默认值
        this.selectedOptions = this.initialVal;
    },
    template: `<el-cascader :expand-trigger="triggerType" :options="options" v-model="selectedOptions" @change="handleChange"></el-cascader>`
});