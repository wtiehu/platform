/**
 * Created by jms on 2017/8/7.
 */

var keyValueSetAdd = new Vue({
    el: '#keyValueSetAdd',
    data: function () {
        return {
            labelPosition: 'right',
            keyForm:{
                keysetCodeInput: '',
                numberInput:'',
                keysetNameInput: '',
                confKeyInput: '',
                confValueInput: '',
                despInput: '',
                versionInput: '',
                disabled:true
            },
            rules: {
                numberInput: [
                    {required: true, message: '请输入编号', trigger: 'blur'},
                ],
                keysetNameInput: [
                    {required: true, message: '请输入名称', trigger: 'blur'}
                ],
                confKeyInput: [
                    {required: true, message: '请输入键', trigger: 'blur'}
                ],
                confValueInput: [
                     {required: true, message: '请输入值', trigger: 'blur'}
                ],
                //despInput: [
                //     {required: true, message: '请输入说明', trigger: 'blur'}
                // ]
            }
        }
    },
    methods: {
        confirm(formName) {
            //var datas = [
            //    this.$refs.numberInput,
            //    this.$refs.keysetNameInput,
            //    this.$refs.confKeyInput,
            //    this.$refs.confValueInput,
            //];
            //for (var i = 0; i < datas.length; i++) {
            //    if (datas[i].value == '') {
            //        ibcpLayer.ShowMsg(datas[i].placeholder);
            //        return;
            //    }
            //}
            this.$refs[formName].validate(function (valid) {
                if (valid) {
                    if (operate == 1) {
                        addObj.addOk(function(){
                            keyValueSetAdd.$http.jsonp(insert, {
                                //keysetCode: keyValueSetAdd.keyForm.keysetCodeInput,
                                number:keyValueSetAdd.keyForm.numberInput,
                                keysetName: keyValueSetAdd.keyForm.keysetNameInput,
                                confKey: keyValueSetAdd.keyForm.confKeyInput,
                                confValue: keyValueSetAdd.keyForm.confValueInput,
                                desp: keyValueSetAdd.keyForm.despInput,
                                //version: keyValueSetAdd.version
                            }, {
                                jsonp: 'callback'
                            }).then(function (res) {
                                showMsg.MsgOk(keyValueSet,res)
                                keyValueSet.input='';
                                queryData.getData(queryPage,keyValueSet.input,keyValueSet,function(res){});
                                //keyValueSet.search();
                                ibcpLayer.Close(divIndex);
                            });
                        },function(){
                            showMsg.MsgError(keyValueSet)
                        })
                    }
                    if (operate == 2) {
                        editObj.editOk(function(){
                            keyValueSetAdd.$http.jsonp(modify, {
                                //拿到这条数据的ID
                                rowId: keyValueSet.currentVal.rowId,
                                //keysetCode: keyValueSetAdd.keysetCodeInput,
                                number:keyValueSetAdd.keyForm.numberInput,
                                keysetName: keyValueSetAdd.keyForm.keysetNameInput,
                                confKey: keyValueSetAdd.keyForm.confKeyInput,
                                confValue: keyValueSetAdd.keyForm.confValueInput,
                                desp: keyValueSetAdd.keyForm.despInput,
                                // version: keyValueSetAdd.version
                            }, {
                                jsonp: 'callback'
                            }).then(function (res) {
                                showMsg.MsgOk(keyValueSet,res)
                                keyValueSet.input='';
                                //keyValueSet.search();
                                queryData.getData(queryPage,keyValueSet.input,keyValueSet,function(res){});
                                ibcpLayer.Close(divIndex);
                            });
                        },function(){
                            showMsg.MsgError(keyValueSet)
                        })
                    }
                }
            })
        },
        cancel() {
            ibcpLayer.Close(divIndex);
        }
    }
})
