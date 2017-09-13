/**
 * Created by jms on 2017/8/7.
 */
var str=serverPath+"/sequenceRule";
var query=str+"/query";
var queryById=str+"/queryById"
var insertUrl=str+"/add";
var modifyUrl=str+"/modify";
var del=str+"/delete";
var queryPage=str+"/queryPage";
var mock=str+"/mock";
var resetUrl=str+"/reset";

var config=new Vue({
    el:'#srconfig',
    data:getData.dataObj({
        rowId:'',//重置选中的rowId
        divIndex:'',
        operate:'',
    }),
    methods:{
        search(){
            this.searchPage();
        },
        searchPage(){
            pagingObj.Example(queryPage,this.input, this.pageSize,this.pageNum,this);
        },
        onClick(row, event, column){
            this.currentVal=row;
            config.rowId=config.currentVal.rowId;
            var data={
                "url":queryById,
                "jsonData":{rowId:config.currentVal.rowId},
                "obj":config
            }
            gmpAjax.showAjax(data,function(res){
                    var data=res;
                    config.keyValueContent=data;
                })
        },
        addEvent(){
            this.operate = 1;
            var htmlUrl="add-sequence-rule-config.html";
            this.divIndex=ibcpLayer.ShowIframe(htmlUrl, '新增序列号规则配置', '1000px', "500px",true);
        },
        editEvent(){
            this.operate=2;
            var htmlUrl = 'add-sequence-rule-config.html';
            this.divIndex = ibcpLayer.ShowIframe(htmlUrl, '编辑序列号规则配置', '1000px', '500px');
        },
        deleteEvent(){
            deleteObj.del(function(){
                config.$http.jsonp(del,{
                    rowId:config.currentVal.rowId
                }, {
                    jsonp: 'callback'
                }).then(function (res) {
                    ibcpLayer.ShowOK(res.data.message);
                    config.searchPage();
                });

            })
        },
        handleSizeChange(val){//每页显示多少条
            this.pageSize=val;
            this.searchPage();
        },
        handleCurrentChange(val){//点击第几页
            this.pageNum=val;
            this.searchPage();
        },
        headSort(column){//列头排序
            pagingObj.headSorts1(queryPage,this.input,column,this);
        },
        //重置
        reset(){

            var htmlUrl='sequence-rule-config-reset.html';
            resetIndex = ibcpLayer.ShowDiv(htmlUrl, '序列重置', '400px', '420px',function(){
                var data={
                    "url":queryById,
                    "jsonData":{rowId:config.currentVal.rowId},
                    "obj":config
                }
                gmpAjax.showAjax(data, function(res){
                        var data=res.data;
                        seqReset.resetform.seqCode=data[0].seqCode;
                        seqReset.resetform.seqName=data[0].seqName;
                        seqReset.resetform.seqContent=data[0].seqContent;
                     })
            });

        }
    },
    created(){
        this.searchPage();
    }
})
