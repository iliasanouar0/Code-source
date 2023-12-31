// let user = JSON.parse(sessionStorage.user);
console.log('welcome to settings');

$(document).on('click', '#refresh', () => {
    getDataSettings()
})

$(document).on('click', '.notes', () => {
    $('#notes').modal('show')
})

$(document).on('click', '#add_table', () => {
    $('.add_table').modal('show')
})

$(document).on('click', '.switch_inp', () => {
    $('.input_way, .text_way').toggle(200)
    $('.switch_inp i').toggleClass(`fa-keyboard fa-list`)
})

$(function () {
    var availableTags = [
        "CREATE TABLE IF NOT EXIST --name-- (id SERIAL NOT NULL ,--column-name-- DATATYPE,...) ",
    ];
    $("#sqlCreateTable").autocomplete({
        source: availableTags
    });
});

$(document).on('change', '.index_default', event => {
    if ($(event.target).val() == 'PRIMARY') {
        $(event.target).closest('tr').find('.default_type').children('[value="NONE"]').attr('selected', 'selected')
    }
})

const tableDate = (num) => {
    let tr = `<tr>
    <td class="text-center">
        <input id="field_${num}_1" type="text"
            name="field_name[${num}]" maxlength="64"
            class="textfield form-control" title="Column"
            size="10" value="">
    </td>
    <td class="text-center">
        <select class="column_type form-control"
            name="field_type[${num}]" id="field_${num}_2">
            <option data-length-restricted="1"
                title="A 4-byte integer, signed range is -2,147,483,648 to 2,147,483,647, unsigned range is 0 to 4,294,967,295">
                INT</option>
            <option data-length-restricted="1">
                SERIAL</option>
            <option data-length-restricted="0"
                title="A variable-length (0-65,535) string, the effective maximum length is subject to the maximum row size">
                VARCHAR</option>
            <option data-length-restricted="0"
                title="A TEXT column with a maximum length of 65,535 (2^16 - 1) characters, stored with a two-byte prefix indicating the length of the value in bytes">
                TEXT</option>
            <option data-length-restricted="0"
                title="A date, supported range is 1000-01-01 to 9999-12-31">
                DATE</option>
            <optgroup label="Numeric">
                <option data-length-restricted="1"
                    title="A 1-byte integer, signed range is -128 to 127, unsigned range is 0 to 255">
                    TINYINT</option>
                <option data-length-restricted="1"
                    title="A 2-byte integer, signed range is -32,768 to 32,767, unsigned range is 0 to 65,535">
                    SMALLINT</option>
                <option data-length-restricted="1"
                    title="A 3-byte integer, signed range is -8,388,608 to 8,388,607, unsigned range is 0 to 16,777,215">
                    MEDIUMINT</option>
                <option data-length-restricted="1"
                    title="A 4-byte integer, signed range is -2,147,483,648 to 2,147,483,647, unsigned range is 0 to 4,294,967,295">
                    INT</option>
                <option data-length-restricted="1"
                    title="An 8-byte integer, signed range is -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807, unsigned range is 0 to 18,446,744,073,709,551,615">
                    BIGINT</option>
                <option disabled="disabled">-</option>
                <option data-length-restricted="0"
                    title="A fixed-point number (M, D) - the maximum number of digits (M) is 65 (default 10), the maximum number of decimals (D) is 30 (default 0)">
                    DECIMAL</option>
                <option data-length-restricted="0"
                    title="A small floating-point number, allowable values are -3.402823466E+38 to -1.175494351E-38, 0, and 1.175494351E-38 to 3.402823466E+38">
                    FLOAT</option>
                <option data-length-restricted="0"
                    title="A double-precision floating-point number, allowable values are -1.7976931348623157E+308 to -2.2250738585072014E-308, 0, and 2.2250738585072014E-308 to 1.7976931348623157E+308">
                    DOUBLE</option>
                <option data-length-restricted="0"
                    title="Synonym for DOUBLE (exception: in REAL_AS_FLOAT SQL mode it is a synonym for FLOAT)">
                    REAL</option>
                <option disabled="disabled">-</option>
                <option data-length-restricted="0"
                    title="A bit-field type (M), storing M of bits per value (default is 1, maximum is 64)">
                    BIT</option>
                <option data-length-restricted="0"
                    title="A synonym for TINYINT(1), a value of zero is considered false, nonzero values are considered true">
                    BOOLEAN</option>
                <option data-length-restricted="0"
                    title="An alias for BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE">
                    SERIAL</option>
            </optgroup>
            <optgroup label="Date and time">
                <option data-length-restricted="0"
                    title="A date, supported range is 1000-01-01 to 9999-12-31">
                    DATE</option>
                <option data-length-restricted="0"
                    title="A date and time combination, supported range is 1000-01-01 00:00:00 to 9999-12-31 23:59:59">
                    DATETIME</option>
                <option data-length-restricted="0"
                    title="A timestamp, range is 1970-01-01 00:00:01 UTC to 2038-01-09 03:14:07 UTC, stored as the number of seconds since the epoch (1970-01-01 00:00:00 UTC)">
                    TIMESTAMP</option>
                <option data-length-restricted="0"
                    title="A time, range is -838:59:59 to 838:59:59">
                    TIME</option>
                <option data-length-restricted="0"
                    title="A year in four-digit (4, default) or two-digit (2) format, the allowable values are 70 (1970) to 69 (2069) or 1901 to 2155 and 0000">
                    YEAR</option>
            </optgroup>
            <optgroup label="String">
                <option data-length-restricted="0"
                    title="A fixed-length (0-255, default 1) string that is always right-padded with spaces to the specified length when stored">
                    CHAR</option>
                <option data-length-restricted="0"
                    title="A variable-length (0-65,535) string, the effective maximum length is subject to the maximum row size">
                    VARCHAR</option>
                <option disabled="disabled">-</option>
                <option data-length-restricted="0"
                    title="A TEXT column with a maximum length of 255 (2^8 - 1) characters, stored with a one-byte prefix indicating the length of the value in bytes">
                    TINYTEXT</option>
                <option data-length-restricted="0"
                    title="A TEXT column with a maximum length of 65,535 (2^16 - 1) characters, stored with a two-byte prefix indicating the length of the value in bytes">
                    TEXT</option>
                <option data-length-restricted="0"
                    title="A TEXT column with a maximum length of 16,777,215 (2^24 - 1) characters, stored with a three-byte prefix indicating the length of the value in bytes">
                    MEDIUMTEXT</option>
                <option data-length-restricted="0"
                    title="A TEXT column with a maximum length of 4,294,967,295 or 4GiB (2^32 - 1) characters, stored with a four-byte prefix indicating the length of the value in bytes">
                    LONGTEXT</option>
                <option disabled="disabled">-</option>
                <option data-length-restricted="0"
                    title="Similar to the CHAR type, but stores binary byte strings rather than non-binary character strings">
                    BINARY</option>
                <option data-length-restricted="0"
                    title="Similar to the VARCHAR type, but stores binary byte strings rather than non-binary character strings">
                    VARBINARY</option>
                <option disabled="disabled">-</option>
                <option data-length-restricted="0"
                    title="A BLOB column with a maximum length of 255 (2^8 - 1) bytes, stored with a one-byte prefix indicating the length of the value">
                    TINYBLOB</option>
                <option data-length-restricted="0"
                    title="A BLOB column with a maximum length of 65,535 (2^16 - 1) bytes, stored with a two-byte prefix indicating the length of the value">
                    BLOB</option>
                <option data-length-restricted="0"
                    title="A BLOB column with a maximum length of 16,777,215 (2^24 - 1) bytes, stored with a three-byte prefix indicating the length of the value">
                    MEDIUMBLOB</option>
                <option data-length-restricted="0"
                    title="A BLOB column with a maximum length of 4,294,967,295 or 4GiB (2^32 - 1) bytes, stored with a four-byte prefix indicating the length of the value">
                    LONGBLOB</option>
                <option disabled="disabled">-</option>
                <option data-length-restricted="0"
                    title="An enumeration, chosen from the list of up to 65,535 values or the special '' error value">
                    ENUM</option>
                <option data-length-restricted="0"
                    title="A single value chosen from a set of up to 64 members">
                    SET</option>
            </optgroup>
            <optgroup label="Spatial">
                <option data-length-restricted="0"
                    title="A type that can store a geometry of any type">
                    GEOMETRY</option>
                <option data-length-restricted="0"
                    title="A point in 2-dimensional space">
                    POINT</option>
                <option data-length-restricted="0"
                    title="A curve with linear interpolation between points">
                    LINESTRING</option>
                <option data-length-restricted="0"
                    title="A polygon">POLYGON</option>
                <option data-length-restricted="0"
                    title="A collection of points">
                    MULTIPOINT</option>
                <option data-length-restricted="0"
                    title="A collection of curves with linear interpolation between points">
                    MULTILINESTRING</option>
                <option data-length-restricted="0"
                    title="A collection of polygons">
                    MULTIPOLYGON</option>
                <option data-length-restricted="0"
                    title="A collection of geometry objects of any type">
                    GEOMETRYCOLLECTION</option>
            </optgroup>
            <optgroup label="JSON">
                <option data-length-restricted="0"
                    title="Stores and enables efficient access to data in JSON (JavaScript Object Notation) documents">
                    JSON</option>
            </optgroup>
        </select>
    </td>
    <td class="text-center">
        <input id="field_${num}_3" type="text"
            name="field_length[${num}]" size="8" value="1"
            class="textfield form-control">
    </td>
    <td class="text-center">
        <select name="field_default_type[${num}]" id="field_${num}_4"
            class="default_type form-control mb-1">
            <option value="NONE">
                None </option>
            <option value="NOT NULL">
            NOT NULL</option>
            <option value="NULL">
                NULL
            </option>
            <option value="CURRENT_TIMESTAMP">
                CURRENT_TIMESTAMP
            </option>
        </select>
    </td>
    <td class="text-center">
        <select name="field_key[${num}]" id="field_${num}_5"
            class="form-select index_default" data-index="">
            <option value="none_0">---</option>
            <option value="PRIMARY KEY" title="Primary key">
                PRIMARY
            </option>
            <option value="UNIQUE" title="Unique">
                UNIQUE
            </option>
        </select>
    </td>
    </tr>`
    return tr
}

$(document).on('click', '#show_table', e => {
    e.preventDefault()
    let table_name = $('#tname').val()
    let column_number = parseInt($('#cnum').val())
    if (table_name == '' || column_number == '' || isNaN(column_number) || column_number < 0) {
        $('#table_columns').empty()
        Swal.fire('field is empty or invalid value')
        return
    }
    $('#table_columns').empty()
    for (let i = 0; i < column_number; i++) {
        let tr = tableDate(i)
        $('#table_columns').append(tr)
    }
    $('.Columns').css('display', 'block')
})

$(document).on('click', '#a_show_table', e => {
    e.preventDefault()
    let table_name = $('#a_tname').val()
    let column_number = parseInt($('#a_cnum').val())
    if (table_name == '' || column_number == '' || isNaN(column_number) || column_number < 0) {
        $('#table_columns').empty()
        Swal.fire('field is empty or invalid value')
        return
    }
    $('#a_table_columns').empty()
    for (let i = 0; i < column_number; i++) {
        let tr = tableDate(i)
        $('#a_table_columns').append(tr)
    }
    $('.Columns').css('display', 'block')
})

$(document).on('click', '#t_add', () => {
    let table_name = $('#tname').val()
    let textfield = $('.textfield')
    for (let i = 0; i < textfield.length; i++) {
        if ($(textfield[i]).val() == '') {
            swal.fire('all field required')
            return
        }
    }
    let props = []
    let result = []
    let rows = $('#table_columns').children()
    for (let i = 0; i < rows.length; i++) {
        let td = $(rows[i]).children()
        props.push(i)
        for (let j = 0; j < td.length; j++) {
            let val = $(`#field_${i}_${j + 1}`).val()
            props.push(val)
        }
    }
    for (let x = 0; x < rows.length; x++) {
        let start = props.indexOf(x)
        let end = props.indexOf(x + 1)
        if (end < 0) {
            result.push(props.slice(start));
        } else {
            result.push(props.slice(start, end));
        }
    }
    let sql = `CREATE TABLE IF NOT EXISTS ${table_name} (`
    let c = 0
    let length = result.length
    let error = false
    result.forEach(column => {
        c++
        if (c == length) {
            if (column[2] == 'VARCHAR') {
                if (column[4] == 'CURRENT_TIMESTAMP') {
                    swal.fire({
                        title: 'INVALID VALUE',
                        text: 'CURRENT_TIMESTAMP for VARCHAR type column :(',
                        icon: 'error',
                        showConfirmButton: false
                    })
                    error = true
                } else if (column[5] == 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `${column[1]} ${column[2]}(${column[3]}) ${column[4]})`
                } else if (column[5] == 'none_0' && (column[4] == 'NULL' || column[4] == 'NONE')) {
                    sql += `${column[1]} ${column[2]}(${column[3]}))`
                } else if (column[5] != 'none_0' && (column[4] == 'NONE' || column[4] == 'NULL')) {
                    sql += `${column[1]} ${column[2]}(${column[3]}) ${column[5]})`
                } else if (column[5] != 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `${column[1]} ${column[2]}(${column[3]}) ${column[4]} ${column[5]})`
                } else {
                    sql += `${column[1]} ${column[2]}(${column[3]}) ${column[4]} ${column[5]})`
                }
            } else if (column[2] == 'TIMESTAMP') {
                if (column[4] == 'CURRENT_TIMESTAMP') {
                    if (column[5] == 'none_0') {
                        sql += `${column[1]} ${column[2]} DEFAULT ${column[4]})`
                    } else {
                        sql += `${column[1]} ${column[2]} DEFAULT ${column[4]} ${column[5]})`
                    }
                }
            } else {
                if (column[5] == 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `${column[1]} ${column[2]} ${column[4]})`
                } else if (column[5] == 'none_0' && (column[4] == 'NULL' || column[4] == 'NONE')) {
                    sql += `${column[1]} ${column[2]})`
                } else if (column[5] != 'none_0' && (column[4] == 'NULL' || column[4] == 'NONE')) {
                    sql += `${column[1]} ${column[2]} ${column[5]})`
                } else if (column[5] != 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `${column[1]} ${column[2]} ${column[4]} ${column[5]})`
                } else {
                    sql += `${column[1]} ${column[2]} ${column[4]} ${column[5]})`
                }
            }
        } else {
            if (column[2] == 'VARCHAR') {
                if (column[4] == 'CURRENT_TIMESTAMP') {
                    swal.fire({
                        title: 'INVALID VALUE',
                        text: 'CURRENT_TIMESTAMP for VARCHAR type column :(',
                        icon: 'error',
                        showConfirmButton: false
                    })
                    error = true
                } else if (column[5] == 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `${column[1]} ${column[2]}(${column[3]}) ${column[4]},`
                } else if (column[5] == 'none_0' && (column[4] == 'NULL' || column[4] == 'NONE')) {
                    sql += `${column[1]} ${column[2]}(${column[3]}),`
                } else if (column[5] != 'none_0' && (column[4] == 'NONE' || column[4] == 'NULL')) {
                    sql += `${column[1]} ${column[2]}(${column[3]}) ${column[5]},`
                } else if (column[5] != 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `${column[1]} ${column[2]}(${column[3]}) ${column[4]} ${column[5]},`
                } else {
                    sql += `${column[1]} ${column[2]}(${column[3]}) ${column[4]} ${column[5]},`
                }
            } else if (column[2] == 'TIMESTAMP') {
                if (column[4] == 'CURRENT_TIMESTAMP') {
                    if (column[5] == 'none_0') {
                        sql += `${column[1]} ${column[2]} DEFAULT ${column[4]},`
                    } else {
                        sql += `${column[1]} ${column[2]} DEFAULT ${column[4]} ${column[5]},`
                    }
                }
            } else {
                if (column[5] == 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `${column[1]} ${column[2]} ${column[4]},`
                } else if (column[5] == 'none_0' && (column[4] == 'NULL' || column[4] == 'NONE')) {
                    sql += `${column[1]} ${column[2]},`
                } else if (column[5] != 'none_0' && (column[4] == 'NULL' || column[4] == 'NONE')) {
                    sql += `${column[1]} ${column[2]} ${column[5]},`
                } else if (column[5] != 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `${column[1]} ${column[2]} ${column[4]} ${column[5]},`
                } else {
                    sql += `${column[1]} ${column[2]} ${column[4]} ${column[5]},`
                }
            }
        }
    });
    if (error) {
        return
    } else {
        var settings = {
            "url": `http://${ip}:3000/settings/create/`,
            "method": "POST",
            "timeout": 0,
            "data": JSON.stringify({
                sql: `${sql}`
            }),
            "headers": {
                "Content-Type": "application/json",
            },
        };
        $.ajax(settings).done(function (response) {
            if (response.indexOf('error') > 0) {
                swal.fire({
                    title: 'Error',
                    text: response,
                    icon: 'error'
                })
            } else {
                swal.fire({
                    title: 'Created',
                    text: response,
                    icon: 'success'
                })
                $('.add_table input').val('')
                $('.add_table').modal('hide')
                $('#table_columns').empty()
                getDataSettings()
            }
        });
    }
})

$(document).on('click', '#c_add', () => {
    let table_name = $('#a_tname').val()
    let textfield = $('.textfield')
    for (let i = 0; i < textfield.length; i++) {
        if ($(textfield[i]).val() == '') {
            swal.fire('all field required')
            return
        }
    }
    let props = []
    let result = []
    let rows = $('#a_table_columns').children()
    for (let i = 0; i < rows.length; i++) {
        let td = $(rows[i]).children()
        props.push(i)
        for (let j = 0; j < td.length; j++) {
            let val = $(`#field_${i}_${j + 1}`).val()
            props.push(val)
        }
    }
    for (let x = 0; x < rows.length; x++) {
        let start = props.indexOf(x)
        let end = props.indexOf(x + 1)
        if (end < 0) {
            result.push(props.slice(start));
        } else {
            result.push(props.slice(start, end));
        }
    }
    let sql = `ALTER TABLE ${table_name} `
    let c = 0
    let length = result.length
    let error = false
    result.forEach(column => {
        c++
        if (c == length) {
            if (column[2] == 'VARCHAR') {
                if (column[4] == 'CURRENT_TIMESTAMP') {
                    swal.fire({
                        title: 'INVALID VALUE',
                        text: 'CURRENT_TIMESTAMP for VARCHAR type column :(',
                        icon: 'error',
                        showConfirmButton: false
                    })
                    error = true
                } else if (column[5] == 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]}(${column[3]}) ${column[4]}`
                } else if (column[5] == 'none_0' && (column[4] == 'NULL' || column[4] == 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]}(${column[3]})`
                } else if (column[5] != 'none_0' && (column[4] == 'NONE' || column[4] == 'NULL')) {
                    sql += `ADD ${column[1]} ${column[2]}(${column[3]}) ${column[5]}`
                } else if (column[5] != 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]}(${column[3]}) ${column[4]} ${column[5]}`
                } else {
                    sql += `ADD ${column[1]} ${column[2]}(${column[3]}) ${column[4]} ${column[5]}`
                }
            } else if (column[2] == 'TIMESTAMP') {
                if (column[4] == 'CURRENT_TIMESTAMP') {
                    if (column[5] == 'none_0') {
                        sql += `ADD ${column[1]} ${column[2]} DEFAULT ${column[4]}`
                    } else {
                        sql += `ADD ${column[1]} ${column[2]} DEFAULT ${column[4]} ${column[5]}`
                    }
                }
            } else {
                if (column[5] == 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]} ${column[4]}`
                } else if (column[5] == 'none_0' && (column[4] == 'NULL' || column[4] == 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]}`
                } else if (column[5] != 'none_0' && (column[4] == 'NULL' || column[4] == 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]} ${column[5]}`
                } else if (column[5] != 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]} ${column[4]} ${column[5]}`
                } else {
                    sql += `ADD ${column[1]} ${column[2]} ${column[4]} ${column[5]}`
                }
            }
        } else {
            if (column[2] == 'VARCHAR') {
                if (column[4] == 'CURRENT_TIMESTAMP') {
                    swal.fire({
                        title: 'INVALID VALUE',
                        text: 'CURRENT_TIMESTAMP for VARCHAR type column :(',
                        icon: 'error',
                        showConfirmButton: false
                    })
                    error = true
                } else if (column[5] == 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]}(${column[3]}) ${column[4]},`
                } else if (column[5] == 'none_0' && (column[4] == 'NULL' || column[4] == 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]}(${column[3]}),`
                } else if (column[5] != 'none_0' && (column[4] == 'NONE' || column[4] == 'NULL')) {
                    sql += `ADD ${column[1]} ${column[2]}(${column[3]}) ${column[5]},`
                } else if (column[5] != 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]}(${column[3]}) ${column[4]} ${column[5]},`
                } else {
                    sql += `ADD ${column[1]} ${column[2]}(${column[3]}) ${column[4]} ${column[5]},`
                }
            } else if (column[2] == 'TIMESTAMP') {
                if (column[4] == 'CURRENT_TIMESTAMP') {
                    if (column[5] == 'none_0') {
                        sql += `ADD ${column[1]} ${column[2]} DEFAULT ${column[4]},`
                    } else {
                        sql += `ADD ${column[1]} ${column[2]} DEFAULT ${column[4]} ${column[5]},`
                    }
                }
            } else {
                if (column[5] == 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]} ${column[4]},`
                } else if (column[5] == 'none_0' && (column[4] == 'NULL' || column[4] == 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]},`
                } else if (column[5] != 'none_0' && (column[4] == 'NULL' || column[4] == 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]} ${column[5]},`
                } else if (column[5] != 'none_0' && (column[4] != 'NULL' && column[4] != 'NONE')) {
                    sql += `ADD ${column[1]} ${column[2]} ${column[4]} ${column[5]},`
                } else {
                    sql += `ADD ${column[1]} ${column[2]} ${column[4]} ${column[5]},`
                }
            }
        }
    });
    if (error) {
        return
    } else {
        console.log(sql);
        var settings = {
            "url": `http://${ip}:3000/settings/add/`,
            "method": "POST",
            "timeout": 0,
            "data": JSON.stringify({
                sql: `${sql}`
            }),
            "headers": {
                "Content-Type": "application/json",
            },
        };
        $.ajax(settings).done(function (response) {
            if (response.indexOf('error') > 0) {
                swal.fire({
                    title: 'Error',
                    text: response,
                    icon: 'error'
                })
            } else {
                swal.fire({
                    title: 'Created',
                    text: response,
                    icon: 'success'
                })
                getDataSettings()
                $('#a_table_columns').empty()
                $('.add_column input').val('')
                $('.add_column').modal('hide')
            }
        });
    }
})

$(document).on('click', '.delete', event => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'black',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let table = $(event.target).data('name')
            let sql = `DROP TABLE ${table}`
            var settings = {
                "url": `http://${ip}:3000/settings/delete/`,
                "method": "POST",
                "timeout": 0,
                "data": JSON.stringify({
                    sql: `${sql}`
                }),
                "headers": {
                    "Content-Type": "application/json",
                },
            };
            $.ajax(settings).done(function (response) {
                if (response.indexOf('error') > 0) {
                    swal.fire({
                        title: 'Error',
                        text: response,
                        icon: 'error'
                    })
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: response,
                        showConfirmButton: false,
                        timer: 3000
                    })
                    getDataSettings()
                }
            });
        } else if (result.isDismissed) {
            console.log("cancelled");
        }
    })
})

$(document).on('click', '.add', event => {
    let table = $(event.target).data('name')
    $('#a_tname').val(table)
    $('.add_column').modal('show')
})

$(document).on('click', '.column-drop', event => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'black',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let column = $(event.target).data('name')
            let table = $(event.target).data('table')
            let sql = `ALTER TABLE ${table} DROP ${column}`
            var settings = {
                "url": `http://${ip}:3000/settings/delete/column`,
                "method": "POST",
                "timeout": 0,
                "data": JSON.stringify({
                    sql: `${sql}`
                }),
                "headers": {
                    "Content-Type": "application/json",
                },
            };
            $.ajax(settings).done(function (response) {
                if (response.indexOf('error') > 0) {
                    swal.fire({
                        title: 'Error',
                        text: response,
                        icon: 'error'
                    })
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: response,
                        showConfirmButton: false,
                        timer: 3000
                    })
                    getDataSettings()
                }
            });
        } else if (result.isDismissed) {
            console.log("cancelled");
        }
    })
})