/**
 * Created by andim on 2017/8/2.
 */
//左边table
var functionBlock = new Vue({
    el:"#app",
    data:{
        tableId:'Block',
        loading:true,
        input:'',
        tableData:[],
        leftHeight:'',
        //url:serverPath+'/fronc/query',//查询所有功能块信息
        Selurl:serverPath+'/fronc/queryPage',//查询所有功能块信息
        selUrlId:serverPath+'/fronc/queryById',//根据rowId查所有信息
        deleteId:'',
        rowId:'',
        editObj:'',
        divIndex:'',
        pageNum:1,//当前页号
        pageSize:10,//每页显示数据条数
        allDate:0//共多少条数据
    },
    methods:{
        //查询
        get(){
            pagingObj.Example(this.Selurl,this.input,this.pageSize,this.pageNum,this,function(){
                //functionBlock.pageNum = 1;
                functionBlock.click(functionBlock.tableData[0]);
                if(functionBlock.tableData.length>0){
                    functionBlock.deleteId = functionBlock.tableData[0].rowId;
                    properties.getRight(functionBlock.tableData[0].rowId);
                }else{
                    properties.loading = false;
                }
            });
        },
        //编辑
        editBlock(){
            this.divIndex = ibcpLayer.ShowDiv('add-block.html','编辑功能块','400px', '420px',function(){
                functionBlock.$http.jsonp(functionBlock.selUrlId,{
                    rowId:functionBlock.rowId
                },{
                    jsonp:'callback'
                }).then(function(res){
                    var data = res.data.data;
                    em.isEdit = true;
                    em.formTable.codeInput=data[0].funcCode;
                    em.formTable.nameInput=data[0].funcName;
                    em.$refs.fbtype.value=data[0].funcType;
                    console.log(data[0].funcType);
                    em.dataId=data[0].relateBusiObj;
                    //em.$refs.conObj.connectObj=functionBlock.editObj.objectName;
                    em.$refs.conObj.connectObj=data[0].relateBusiObj;
                    em.formTable.desp=data[0].desp;
                    em.rowId=data[0].rowId;
                })
                // console.log(functionBlock.editObj);
                // em.isEdit = true;
                // em.formTable.codeInput=functionBlock.editObj.funcCode;
                // em.formTable.nameInput=functionBlock.editObj.funcName;
                // em.$refs.fbtype.value=functionBlock.editObj.funcType;
                // console.log(functionBlock.editObj.funcType);
                // em.dataId=functionBlock.editObj.relateBusiObj;
                // //em.$refs.conObj.connectObj=functionBlock.editObj.objectName;
                // em.$refs.conObj.connectObj=functionBlock.editObj.relateBusiObj;
                // em.formTable.desp=functionBlock.editObj.desp;
                // em.rowId=functionBlock.editObj.rowId;
            });
        },
        //删除
        del(){
            deleteObj.del(function(){
                functionBlock.$http.jsonp(serverPath+"/fronc/delete",{
                    rowId:functionBlock.deleteId
                },{
                    jsonp:'callback'
                }).then(function(res){
                    showMsg.MsgOk(functionBlock,res);
                    //functionBlock.get();
                    queryData.getData(this.Selurl,this.input,this)
                },function(){
                    showMsg.MsgError(functionBlock);
                })
            })
        },
        //点击
        click(row, event, column){
            if(row){
                properties.rightInput = '';
                this.rowId = row.rowId;
                properties.getRight(row.rowId);
                this.deleteId = row.rowId;
                this.editObj = row;
            }
        },
        //选中
        FindOk(row){
            this.$refs.myTable.setCurrentRow(row);
        },
        //分页显示数据条数变化
        handleSizeChange(val){
            this.pageSize=val;
            this.get();
        },
        //分页页数变化
        handleCurrentChange(val){
            this.pageNum=val;
            this.get();
        },
        headSort(column){//列头排序
            console.log(column.prop);
            pagingObj.headSort(this.Selurl,this.input,this.pageSize,this.pageNum,column,this,function(res){
                properties.getRight(functionBlock.tableData[0].rowId);
            });
        }
    },
    created(){
        var args={"Block":{funcType:"functionBlockType"},"blockAttribute":{displayWidget:"showControl"}};
        TableKeyValueSet.init(args);
        this.get();
        $(document).ready(function(){
            functionBlock.leftHeight=$(window).height()-190;
        });
        $(window).resize(function(){
            functionBlock.leftHeight=$(window).height()-190;
        })
    },
    updated(){
        if(this.tableData.length>0){
            this.FindOk(this.tableData[0]);
        }
    }
});

//右边table
var properties = new Vue({
    el:'#right',
    data:{
        tableId:'blockAttribute',
        loading:true,
        tableData:[],
        findRightDataUrl:serverPath+'/fronFuncPro/queryProPage',//查询指定ID功能块的属性信息
        rightHeight:'',
        rightInput:'',//右边表输入框
        rowId:'',//选中属性行ID
        funcId:'',//功能块ID
        divIndex:'',
        pageNum:1,//当前页号
        pageSize:10,//每页显示数据条数
        allDate:0//共多少条数据
    },
    methods:{
        handleClick(){//查看按钮
            this.divIndex = ibcpLayer.ShowDiv('attribute-details.html','属性明细','400px', '460px',function(){

            });
        },
        //点击右边table
        clickRightTable(row, event, column){
            if(row){
                this.rowId = row.rowId;
                this.funcId = row.funcRowId;
            }
        },
        //选中
        FindOk(row){
            this.$refs.myTable.setCurrentRow(row);
        },
        //查询
        getRight(id){
            pagingObj.Examples(this.findRightDataUrl,id,this.rightInput,this.pageSize,this.pageNum,this,function(){
                properties.clickRightTable(properties.tableData[0]);
            });
        },
        //分页查询
        getRightData(){
            pagingObj.Examples(this.findRightDataUrl,functionBlock.rowId,this.rightInput,this.pageSize,this.pageNum,this,function(){
                properties.clickRightTable(properties.tableData[0]);
            });
        },
        //分页显示数据条数变化
        handleSizeChange(val){
            this.pageSize=val;
            this.getRightData();
        },
        //分页页数变化
        handleCurrentChange(val){
            this.pageNum=val;
            this.getRightData();
        },
        headSort(column){//列头排序
            pagingObj.headSorts(this.findRightDataUrl,functionBlock.rowId,this.input,column,this);
        },
        //编辑属性
        editData(){
            topButtonObj.rowObjId = functionBlock.editObj.rowId;
            topButtonObj.objId = functionBlock.editObj.relateBusiObj;
            topButtonObj.isEdit = true;
            topButtonObj.divIndex = ibcpLayer.ShowIframe('add-data.html','编辑属性','500px', '550px')
        },
        //删除属性
        delData(){
            deleteObj.del(function(){
                properties.$http.jsonp(topButtonObj.delUrl,{
                    rowId:properties.rowId
                },{
                    jsonp:'callback'
                }).then(function(res){
                    //properties.getRight(properties.funcId);
                    queryData.getDatas(properties.findRightDataUrl,properties.rightInput,properties.funcId,properties);
                    showMsg.MsgOk(properties,res);
                },function(){
                    showMsg.MsgError(properties);
                })
            })
        },
        wetherDisplay(row){//是否显示
            if(row.wetherDisplay =="true"){
                return "是"
            }else{
                return "否"
            }
        },
        wetherReadonly(row){//是否只读
            if(row.wetherReadonly =="true"){
                return "是"
            }else{
                return "否"
            }
        },
        allowEmpty(row){//是否为空
            if(row.allowEmpty =="true"){
                return "是"
            }else{
                return "否"
            }
        },
    },
    created(){
        //var args={"blockAttribute":{displayWidget:"showControl"}};
        //TableKeyValueSet.init(args);
        $(document).ready(function(){
            properties.rightHeight=$(window).height()-190;
        });
        $(window).resize(function(){
            properties.rightHeight=$(window).height()-190;
        })
    },
    updated(){
        if(this.tableData.length>0){
            this.FindOk(this.tableData[0]);
        }
    }
});

//按钮
var topButtonObj = new Vue({
    el:'#myButton',
    data:{
        divIndex:'',
        rowObjId:'',//功能块ID
        objId:'',//关联业务对象ID
        isEdit:'',//是否编辑
        delUrl:serverPath+'/fronFuncPro/delete'//删除属性接口
    },
    methods: {
        //功能块
        addBlock(){
            this.divIndex = ibcpLayer.ShowDiv('add-block.html','新增功能块','400px', '420px',function(){
                em.isEdit = false;
            });
        },
        editBlock(){
            this.divIndex = ibcpLayer.ShowDiv('demo.html','编辑功能块','400px', '400px',function(){
                em.isEdit = true;
                em.formTable.codeInput=functionBlock.editObj.funcCode;
                em.formTable.nameInput=functionBlock.editObj.funcName;
                em.formTable.typeInput=functionBlock.editObj.funcType;
                em.dataId=functionBlock.editObj.relateBusiObj;
                em.formTable.tableInput=functionBlock.editObj.objectName;
                em.formTable.desp=functionBlock.editObj.desp;
                em.rowId=functionBlock.editObj.rowId;
            });

        },
        del(){
            functionBlock.del();
        },
        //功能块属性
        addData(){
            topButtonObj.rowObjId = functionBlock.editObj.rowId;
            topButtonObj.objId = functionBlock.editObj.relateBusiObj;
            this.isEdit = false;
            topButtonObj.divIndex = ibcpLayer.ShowIframe('add-data.html','新增属性','500px', '550px')
        },
        editData(){
            topButtonObj.rowObjId = functionBlock.editObj.rowId;
            topButtonObj.objId = functionBlock.editObj.relateBusiObj;
            this.isEdit = true;
            topButtonObj.divIndex = ibcpLayer.ShowIframe('add-data.html','编辑属性','500px', '550px')
        },
        delData(){
            this.$http.jsonp(this.delUrl,{
                rowId:properties.rowId
            },{
                jsonp:'callback'
            }).then(function(res){
                properties.getRight(properties.funcId);
                showMsg.MsgOk(functionBlock,res);
            },function(){
                showMsg.MsgError(functionBlock);
            })
        }
    }
})