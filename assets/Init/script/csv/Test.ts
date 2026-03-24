import { _decorator, Component, Node } from 'cc';
import { CsvManager } from './CsvManager';
const { ccclass, property } = _decorator;

@ccclass( 'Test' )
export class Test extends Component
{
    start ()
    {
        CsvManager.Instance.LoadCsv( () =>
        {
            //console.error( CsvManager.Instance.getTable( 'talk' ) );
            //console.error( CsvManager.Instance.queryByID( 'talk', '1' )[ 'content' ] );

            // console.error( CsvManager.Instance.getTableArr( 'talk' ) );
            // console.error( CsvManager.Instance.showTalk( 1 ) );

            //console.error( CsvManager.Instance.getTable( 'signIn' ) );
            //console.error( CsvManager.Instance.getTable( 'car' ) );



            // const row = CsvManager.Instance.queryByID( 'talk', '1' );
            // if ( row )
            // {
            //     console.error( `内容: ${ row.content }` ); // 输出: 你好,请到街对面接我.
            //     console.error( `条件: ${ row.condition }` ); // 输出: true
            // }

            // // 查询 talk 表中，字段 "content" 包含 "停车" 的第一条数据
            // const row1 = CsvManager.Instance.queryOne( 'talk', 'content', '停车!停车!' );
            // if ( row1 )
            // {
            //     console.error( `ID: ${ row1.type }` ); // 输出: 2
            //     console.error( `数组: ${ row1.content1 }` ); // 输出: [apple,banana,oriage]
            // }

            // 注意：csv解析后，TRUE/false 会被转为 布尔类型
            const rows = CsvManager.Instance.queryAll( 'talk', 'condition', true );
            // 遍历结果 (rows 是一个对象，需要用 Object.values 或者 for...in 遍历)
            for ( const key in rows )
            {
                const item = rows[ key ];
                console.error( `找到任务条件为True的ID: ${ item.type }, 内容: ${ item.content }` );
            }

            // 转换为数组
            const resultArr = Object.keys( rows ).map( key => rows[ key ] );
            // 现在可以使用数组方法
            resultArr.forEach( item =>
            {
                console.error( item.content );
                console.error( item.type );
                console.error( item.condition );
                if ( item.condition == true )
                    console.error( '对的' );
                else
                    console.error( '错的' );
                console.error( item.numList );
                console.error( item.numList[ 0 ] );
                console.error( item.numList[ 1 ] );
                console.error( item.numList[ 2 ] );

                console.error( item.strList );
                console.error( item.strList[ 0 ] );
                console.error( item.strList[ 1 ] );
                console.error( item.strList[ 2 ] );
            } );

            const tableData = CsvManager.Instance.getTableArr( 'talk' );
            if ( tableData && tableData.length > 0 )
            {
                // 取第一条数据作为示例
                const row = tableData[ 1 ];
                // console.error( "=== 测试读取 jsonList 字段 ===" );
                //console.error( "原始数据行:", row );


                // === Test.ts 中添加这段调试代码 ===
                const jsonData = row.jsonList;

                console.error( 'money: ' + jsonData[ 0 ].money );
                console.error( 'coin: ' + jsonData[ 0 ].coin );
                console.error( 'gem: ' + jsonData[ 0 ].gem );
                console.error( 'desc: ' + jsonData[ 0 ].desc );

                // console.log( "1. 原始 jsonList:", jsonData );
                //console.log( "2. 类型:", typeof jsonData );
                //console.log( "3. 是否是数组:", Array.isArray( jsonData ) );

                // // 兼容处理
                // let finalObj = null;

                // if ( Array.isArray( jsonData ) )
                // {
                //     console.log( "4. 进入数组分支" );
                //     if ( jsonData.length > 0 )
                //     {
                //         finalObj = jsonData[ 0 ];
                //         console.log( "5. 取出的第一个元素:", finalObj );
                //     }
                // } else if ( typeof jsonData === 'object' && jsonData !== null )
                // {
                //     console.log( "6. 进入对象分支" );
                //     finalObj = jsonData;
                // }

                // console.log( "7. finalObj:", finalObj );
                // console.log( "8. money:", finalObj ? finalObj.money : "finalObj为null" );

                // 访问 JsonList 数据
                // 注意：如果解析成功，这里应该是一个对象，例如：{ money: 10, coin: 20, gem: 5 }
                // 如果解析失败（格式无法识别），它可能是字符串
                //const jsonData = row.jsonList;
                // if ( typeof jsonData === 'object' && jsonData !== null )
                // {
                //     console.error( "解析后的 JsonList 对象:", jsonData );
                //     console.error( "money 值:", jsonData.money );
                //     console.error( "coin 值:", jsonData.coin );
                //     console.error( "gem 值:", jsonData.gem );
                //     console.error( "desc 值:", jsonData.desc );
                //     // 示例：遍历 jsonList 中的键值对
                //     for ( const key in jsonData )
                //     {
                //         console.error( `Item Key: ${ key }, Value: ${ jsonData[ key ] }` );
                //     }
                // } else
                // {
                //     console.error( "jsonList 未被解析为对象，可能是字符串:", jsonData );
                // }
            }



            // // 查询 talk 表中，类型(type) 为 1, 5, 10 的所有数据
            // const typeList = [ 1, 5, 10 ];
            // const rows1 = CsvManager.Instance.queryIn( 'talk', 'type', typeList );
            // for ( const key in rows1 )
            // {
            //     const item = rows1[ key ];
            //     console.error( `在列表中的ID: ${ item.type }, 内容: ${ item.content }` );
            // }

            // 查询条件：type 必须是 [1, 2, 3] 中的某一个
            // 并且 condition 必须是 [true] 中的某一个 (即 true)
            // const condition = {
            //     type: [ 1, 2, 3 ],
            //     condition: [ true ]
            // };
            // const rows2 = CsvManager.Instance.queryByCondition( 'talk', condition );
            // console.error( "符合复合条件的数据:" );
            // for ( const key in rows2 )
            // {
            //     const item = rows2[ key ];
            //     console.error( `Type: ${ item.type }, Content: ${ item.content }, Condition: ${ item.condition }` );
            // }
        } );//Excel表格使用示例       
    }

}

