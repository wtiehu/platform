/**
 * Created by andim on 2017/8/9.
 */

/**
 * 修改下拉框 jms
 * @type {Vue}
 */

var addDataSet = new Vue({
    el:'#addDataSet',
    data:{
        labelPosition:"right",
        formTable:{
            datasetCode:'',
            nameInput:'',
           typeInput:'',    //修改下拉框 jms 2017/8/21
            content:'',
            desp:'',
            version:'',
            belongModule:'',//模块
            belongSystem:'',//系统
        },
        rules:{
            nameInput:[{ required: true, message: '请输入名称', trigger: 'blur' },
                { min: 1, max: 128, message: '长度在 1 到 64 个汉字', trigger: 'blur' }],
            typeInput:[{ required: true, message: '请选择类型', trigger: 'blur' }],
            content:[{max: 1024, message: '长度在 1 到 512 个汉字', trigger: 'blur' }],
            belongModule:[{ required: true, message: '请选择所属模块', trigger: 'blur' }],
            desp:[{max: 1024, message: '长度在 1 到 512 个汉字', trigger: 'blur' }],
        },
        value_1:'',
        isEdit:'',//是否编辑
        addUrl:serverPath+'/dataSetConfig/add',//新增
        editUrl:serverPath+'/dataSetConfig/modify',//编辑

        //类型下拉框
        dataSetType_1:{
            params:'dataSetConfigType',
            value:'',
            disabled:false,
        },
        //所属模块下拉框
        belongModule_1:{
            params:'belongModule',
            value:'',
            disabled:false,
        }
    },
    methods:{
        checkIsNull(){//非空验证
            var data = [
                this.$refs.nameInput,
                // this.$refs.typeInput
            ];
            for(var i=0;i<data.length;i++){
                if(data[i].value==''){
                    ibcpLayer.ShowMsg(data[i].placeholder);
                    return false;
                }
            }
            return true;
        },
        addSet(){//新增
            /**
             * tsj 07/8/30 替换ajax方法，修改赋值
             **/
            var data = {
                "url":addDataSet.addUrl,
                "jsonData":{
                    datasetName:this.formTable.nameInput,
                    datasetType:this.dataSetType_1.value,
                    datasetContent:this.formTable.content,
                    desp:this.formTable.desp,
                    belongModule:this.belongModule_1.value,
                  //  belongSystem:this.formTable.belongSystem
                },
                "obj":addDataSet,
                "showMsg":true
            }
            gmpAjax.showAjax(data,function(res){
                ibcpLayer.Close(dataSetConfigButton.divIndex);
                queryData.getData(dataSetConfig.selUrl,dataSetConfig.input,dataSetConfig)
            })
        },
        editSet(){//编辑
            /**
             * tsj 07/8/30 替换ajax方法，修改赋值
             **/
            var data = {
                "url":addDataSet.editUrl,
                "jsonData":{
                    rowId:dataSetConfig.rowObjId,
                    datasetCode:this.formTable.datasetCode,
                    datasetName:this.formTable.nameInput,
                    datasetType:this.dataSetType_1.value,
                    datasetContent:this.formTable.content,
                    desp:this.formTable.desp,
                    belongModule:this.belongModule_1.value,
                 //   belongSystem:this.formTable.belongSystem
                },
                "obj":addDataSet,
                "showMsg":true
            }
            gmpAjax.showAjax(data,function(res){
                //showMsg.MsgOk(dataSetConfig,res);
                ibcpLayer.Close(dataSetConfigButton.divIndex);
                queryData.getData(dataSetConfig.selUrl,dataSetConfig.input,dataSetConfig);
            })
        },
        conformEvent(formName){//确定
            if(!this.isEdit){//新增
                // if(this.checkIsNull()){
                //     addObj.addOk(function(){
                //         addDataSet.addSet();
                //     })
                // }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addObj.addOk(function(){
                            addDataSet.addSet();
                        })
                    } else {
                        return false;
                    }
                });
            }else{//编辑
                // if(this.checkIsNull()){
                //     editObj.editOk(function(){
                //         addDataSet.editSet();
                //     })
                // }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        editObj.editOk(function(){
                            addDataSet.editSet();
                        })
                    } else {
                        return false;
                    }
                });
            }
        },
        cancel(){//取消
            ibcpLayer.Close(dataSetConfigButton.divIndex);
        },
        getDataSetType_1(data){
            this.dataSetType_1.value=data.value;
            this.formTable.typeInput = data.value;
        },
        getBelongModule_1(datas){
            this.belongModule_1.value=datas.value;
            this.formTable.belongModule = datas.value;
        }
    }
})