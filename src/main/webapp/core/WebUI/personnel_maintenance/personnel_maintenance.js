/**
 * Created by admin on 2017/10/10.
 */
var basTop;
var left;
var leftBottom;
var right;
//右侧查询接口
var searchMore=serverPath + "/user/queryPage";
//左侧查右侧查询接口
var searchLeftMore=serverPath + "/user/queryByOrg";
//编辑查询
var editMore=serverPath + "/user/queryBySpecify";
//删除
var deleteMore=serverPath + "/user/delete";

gmp_onload=function(){
    basTop = new Vue({
        el: '#basTop',
        data: {
            addOpe: false,
            addAttr: false,
            takeEffect: false,
            change: false,
        },
        methods: {
            //新增人员信息
            addEvent() {
                operate = 1;
                var htmlUrl = 'personnel_add.html';
                divIndex = ibcpLayer.ShowDiv(htmlUrl, ' 添加人员信息', '50%', '88%',function(){

                });
            },
            //导出选择版本
            chooseVersion(){
                var htmlUrl = 'chooseVersion.html';
                divIndex = ibcpLayer.ShowDiv(htmlUrl, '选择版本', '300px', '200px',function(){

                });

            },
            //导出
            exportRow(){
                var htmlUrl = 'personnel_export.html';
                divIndex = ibcpLayer.ShowDiv(htmlUrl, '导出Excel', '800px', '400px', function () {


                });
            },
            //新增业务对象属性
            addProp(){
                operateOPr=1;
                var htmlUrl = 'metadata-prop-add.html';
                divIndex = ibcpLayer.ShowDiv(htmlUrl, '新增对象属性', '800px', '400px', function () {
                    proEm.$refs.proType_1.setValue("base");  //属性类型
                    proEm.proType_1.value='base';//不点击的时候直接把属性传过去
                    proEm.addProForm.proType='base';//只是为了验证的时候判断是否为空

                });
            },
            //生效
            affectProp(){
                var data={
                    "url":affectPropUrl,
                    "jsonData":{rowId:basLeft.currentId},
                    "obj":basTop,
                };
                gmpAjax.showAjax(data,function(res){
                    basLeft.searchLeft();
                })
            },
            //变更
            changeProp(){
                var data={
                    "url":changeUrl,
                    "jsonData":{rowId:basLeft.currentId},
                    "obj":basTop
                };
                gmpAjax.showAjax(data,function(res){
                    basLeft.searchLeft();
                })
            },
        }
    });

    left=new Vue({
        el:'#left',
        data:getData.dataObj({
            config: {
                // 显示复选框
                checkbox: false,
                // 默认展开  id
                expanded: [324],
                // 配置显示项
                defaultProps: {
                    // 树节点显示文字
                    label: 'orgName',
                    // 节点id
                    id: "rowId",
                    // 父节点信息
                    parentId: "orgPid",
                    // 当前节点信息
                    selfId: "orgId"
                },
                // 获取数据接口
                url: serverPath + "/baseOrg/queryPage"
            },
            activeName:'first',
        }),
        methods:{
            getNodes(data){
                //console.log(data);
                this.rowId=data.rowId;
                right.searchMore();
            },
            //复选框点击
            getChecked(){

            },

            //tab页点击交换
            handleClick(){

            }

        },
        create(){
            $(document).ready(function () {
                right.leftHeight = $(window).height() - 158;
            });
            $(window).resize(function () {
                right.leftHeight = $(window).height() - 158;
            });
        }
    })

    leftBottom=new Vue({
        el:'#basRightTop',
        template:'#tempBlock',
        data:getData.dataObj({
            data: [{
                label: '一级 11',
                children: [{
                    label: '二级 11-11',
                    children: [{
                        label: '三级 11-11-11'
                    }]
                }]
            }, {
                label: '一级 22',
                children: [{
                    label: '二级 22-11',
                    children: [{
                        label: '三级 22-11-11'
                    }]
                }, {
                    label: '二级 22-22',
                    children: [{
                        label: '三级 22-22-11'
                    }]
                }]
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1'
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1'
                    }]
                }],
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            activeName:'first',
        }),
        methods:{
            handleNodeClick(data){
                //console.log(data);
            },
            handleClick(){

            }

        }
    })

    right=new Vue({
        "el": "#right",
        data: getData.dataObj({
            select: '',//查询类
            chooseState: '',//状态
            couldLook:false,//状态能否被看见
        }),
        methods: {
            headSort(column){
                //列头排序
                // pagingObj.headSort(qurUrl,this.resInput,this.pageSize,this.pageNum,column,this);

            },
            //点击这一行
            currentChange(row, event, column){
                //console.log(row);
                this.rightRowId=row.rowId
            },
            //选择复选框
            selectRow(selection, row){
                //最后选择的这一行
                console.log(row)
                //已经选中的
                console.log(selection)
            },
            //复选框全选
            selectAllRow(selection){
                console.log(selection)
            },
            showMore(){
                this.couldLook=true;
            },
            handleSizeChange(val){
                this.pageSize=val;
            },
            handleCurrentChange(val){
                this.pageNum=val;
            },
            //查询
            searchMore(){
                if(this.select==''){//需要search
                    var param={
                        belongOrg:left.rowId
                    }
                    if(this.chooseState==''){//不需要状态
                        var params=JSON.stringify(param)
                    }else{//需要状态
                        param["status"] = this.chooseState;
                        var params=JSON.stringify(param)
                    }
                    querySearch.needSearch(searchMore,this.input,params,this,function(res){
                        var data=res.resp.content.data;
                        if(data!=null){
                            //默认选中行
                            //this.currentChange(this.tableData[0]);
                        }
                    })
                }else{  //不需要search
                    var param={
                        belongOrg:left.rowId
                    }
                    param[this.select] = this.input;
                    if(this.chooseState==''){//不需要状态
                        var params=JSON.stringify(param)
                    }else{//需要状态
                        param["status"] = this.chooseState;
                        var params=JSON.stringify(param)
                    }
                    querySearch.uneedSearch(searchMore,params,this,function(res){
                        var data=res.resp.content.data;
                        console.log(data);
                        if(data!=null){
                            //默认选中行
                            //this.currentChange(this.tableData[0]);
                        }
                    })
                }
            },
            //默认选中变颜色
            FindRFirstDate(row){
                // console.log(row)
                this.$refs.tableData.setCurrentRow(row);
            },
            //编辑
            editEvent(){
                operate = 2;
                var htmlUrl = 'personnel_add.html';
                divIndex = ibcpLayer.ShowDiv(htmlUrl, ' 编辑人员信息', '600px', '660px',function(){
                    //调用接口
                    var data={
                        "url":editMore,
                        "jsonData":{rowId:right.rightRowId},
                        "obj":right,
                        "showMsg":true
                    };
                    gmpAjax.showAjax(data,function(res){
                        //编辑拿到的数据
                        console.log(res)
                        //var data=res.data;
                        //console.log(data);
                        //em.ruleForm.codeInput = data.objectCode;  //对象代码
                        //em.ruleForm.nameInput =data.objectName;//对象名称
                        //em.ruleForm.className =data.className;//实体类
                        //em.$refs.table_1.setValue(data.relateTableRowId);
                        //em.$refs.templateObj_1.setValue(data.relateTemplateObject);//关联模板对象
                        ////em.$refs.templateObj_1.setValue(data.relateTemplate);//关联模板对象
                        //em.ruleForm.system=data.system;//所属系统
                        //em.$refs.belongModule_1.setValue(data.belongModule);//所属模块
                        //em.ruleForm.versionInput =data.etc.version;//版本
                    })
                });
            },
            //删除
            deleteProp(){
                deleteObj.del(function(){
                    var data={
                        //"url":deleteUrl,
                        //"jsonData":{rowId:basLeft.currentVal.rowId},
                        //"obj":basLeft,
                        //"showMsg":true
                    };
                    //gmpAjax.showAjax(data,function(res){
                    //    //分页跳回到第一页
                    //    basLeft.searchLeft();
                    //})
                })
            }

        },
        created(){
            $(document).ready(function () {
                right.leftHeight = $(window).height() - 206;
            });
            $(window).resize(function () {
                right.leftHeight = $(window).height() - 206;
            });

            $(document).ready(function () {
                var height = $(window).height()-50;
                $("#treeLeft").height(height);

            });
            $(window).resize(function () {
                var height1 = $(window).height()-50;
                $("#treeLeft").height(height1);
            });
        }
    })
}