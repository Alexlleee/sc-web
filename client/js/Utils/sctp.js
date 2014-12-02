
// sc-element types
var sc_type_node = 0x1
var sc_type_link = 0x2
var sc_type_edge_common = 0x4
var sc_type_arc_common = 0x8
var sc_type_arc_access = 0x10

// sc-element constant
var sc_type_const = 0x20
var sc_type_var = 0x40

// sc-element positivity
var sc_type_arc_pos = 0x80
var sc_type_arc_neg = 0x100
var sc_type_arc_fuz = 0x200

// sc-element premanently
var sc_type_arc_temp = 0x400
var sc_type_arc_perm = 0x800

// struct node types
var sc_type_node_tuple = (0x80)
var sc_type_node_struct = (0x100)
var sc_type_node_role = (0x200)
var sc_type_node_norole = (0x400)
var sc_type_node_class = (0x800)
var sc_type_node_abstract = (0x1000)
var sc_type_node_material = (0x2000)


var sc_type_arc_pos_const_perm = (sc_type_arc_access | sc_type_const | sc_type_arc_pos | sc_type_arc_perm)

// type mask
var sc_type_element_mask = (sc_type_node | sc_type_link | sc_type_edge_common | sc_type_arc_common | sc_type_arc_access)
var sc_type_constancy_mask = (sc_type_const | sc_type_var)
var sc_type_positivity_mask = (sc_type_arc_pos | sc_type_arc_neg | sc_type_arc_fuz)
var sc_type_permanency_mask = (sc_type_arc_perm | sc_type_arc_temp)
var sc_type_node_struct_mask = (sc_type_node_tuple | sc_type_node_struct | sc_type_node_role | sc_type_node_norole | sc_type_node_class | sc_type_node_abstract | sc_type_node_material)
var sc_type_arc_mask = (sc_type_arc_access | sc_type_arc_common | sc_type_edge_common)



var SctpCommandType = {
    SCTP_CMD_UNKNOWN:           0x00, // unkown command
    SCTP_CMD_CHECK_ELEMENT:     0x01, // check if specified sc-element exist
    SCTP_CMD_GET_ELEMENT_TYPE:  0x02, // return sc-element type
    SCTP_CMD_ERASE_ELEMENT:     0x03, // erase specified sc-element
    SCTP_CMD_CREATE_NODE:       0x04, // create new sc-node
    SCTP_CMD_CREATE_LINK:       0x05, // create new sc-link
    SCTP_CMD_CREATE_ARC:        0x06, // create new sc-arc
    SCTP_CMD_GET_ARC:           0x07, // return begin element of sc-arc

    SCTP_CMD_GET_LINK_CONTENT:  0x09, // return content of sc-link
    SCTP_CMD_FIND_LINKS:        0x0a, // return sc-links with specified content
    SCTP_CMD_SET_LINK_CONTENT:  0x0b, // setup new content for the link
    SCTP_CMD_ITERATE_ELEMENTS:  0x0c, // return base template iteration result
    
    SCTP_CMD_EVENT_CREATE:      0x0e, // create subscription to specified event
    SCTP_CMD_EVENT_DESTROY:     0x0f, // destroys specified event subscription
    SCTP_CMD_EVENT_EMIT:        0x10, // emits events to client

    SCTP_CMD_FIND_ELEMENT_BY_SYSITDF:   0xa0, // return sc-element by it system identifier
    SCTP_CMD_SET_SYSIDTF:       0xa1, // setup new system identifier for sc-element
    SCTP_CMD_STATISTICS:        0xa2, // return usage statistics from server
};


var SctpResultCode = {
    SCTP_RESULT_OK:                 0x00, 
    SCTP_RESULT_FAIL:               0x01, 
    SCTP_RESULT_ERROR_NO_ELEMENT:   0x02 // sc-element wasn't founded
}


var SctpIteratorType = {
    SCTP_ITERATOR_3F_A_A:       0,
    SCTP_ITERATOR_3A_A_F:       1,
    SCTP_ITERATOR_3F_A_F:       2,
    SCTP_ITERATOR_5F_A_A_A_F:   3,
    SCTP_ITERATOR_5_A_A_F_A_F:  4,
    SCTP_ITERATOR_5_F_A_F_A_F:  5,
    SCTP_ITERATOR_5_F_A_F_A_A:  6,
    SCTP_ITERATOR_5_F_A_A_A_A:  7,
    SCTP_ITERATOR_5_A_A_F_A_A:  8
}

var SctpEventType = {
    SC_EVENT_UNKNOWN:           -1,
    SC_EVENT_ADD_OUTPUT_ARC:     0,
    SC_EVENT_ADD_INPUT_ARC:      1,
    SC_EVENT_REMOVE_OUTPUT_ARC:  2,
    SC_EVENT_REMOVE_INPUT_ARC:   3,
    SC_EVENT_REMOVE_ELEMENT:     4
}

var sc_addr_size = 4,
    sc_type_size = 2,
    sctp_header_size = 10;

sc_addr_from_id = function(sc_id) {
    var a = sc_id.split("_");
    var seg = parseInt(a[0]);
    var offset = parseInt(a[1]);
    
    return (offset << 16) | seg;
}

sc_addr_to_id = function(addr) {
    return (addr & 0xFFFF).toString() + '_' + ((addr >> 16) & 0xFFFF).toString();
}

sc_iterator_type_count = function(it) {
    if (it >= SctpIteratorType.SCTP_ITERATOR_3F_A_A && it <= SctpIteratorType.SCTP_ITERATOR_3F_A_F)
        return 3;
    
    if (it >= SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F && it <= SctpIteratorType.SCTP_ITERATOR_5_A_A_F_A_A)
        return 5;
    
    throw "Unknown iterator type";
}

sc_iteartor_params_size = function(it) {
    switch (it) {
        case SctpIteratorType.SCTP_ITERATOR_3A_A_F:
        case SctpIteratorType.SCTP_ITERATOR_3F_A_A:
            return 8;
        case SctpIteratorType.SCTP_ITERATOR_3F_A_F:
            return 10;
            
        case SctpIteratorType.SCTP_ITERATOR_5_A_A_F_A_A:
        case SctpIteratorType.SCTP_ITERATOR_5_F_A_A_A_A:
            return 12;
            
        case SctpIteratorType.SCTP_ITERATOR_5_A_A_F_A_F:
        case SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F:
        case SctpIteratorType.SCTP_ITERATOR_5_F_A_F_A_A:
            return 14;
            
        case SctpIteratorType.SCTP_ITERATOR_5_F_A_F_A_F:
            return 16;
    };
    
    throw "Unknown iterator type";
}

function SctpCommandBuffer(size) {
    var b, pos = 0, s = size,
        view = new DataView(new ArrayBuffer(size + sctp_header_size));
    
    return b = {
        
        data: view.buffer,
        
        writeUint8: function(v) {
            view.setUint8(pos, v, true);
            pos += 1;
        },
        
        writeUint16: function(v) {
            view.setUint16(pos, v, true);
            pos += 2;
        },
        
        writeUint32: function(v) {
            view.setUint32(pos, v, true);
            pos += 4;
        },
        
        writeBuffer: function(buff) {
            var dstU8 = new Uint8Array(view.buffer, pos);
            var srcU8 = new Uint8Array(buff);
            dstU8.set(srcU8);
            pos += buff.byteLength;
        },
        
        setHeader: function(cmd, flags, id) {
            this.writeUint8(cmd);
            this.writeUint8(flags);
            this.writeUint32(id);
            this.writeUint32(s);
        }
    };
};

function SctpResultBuffer(v) {
    var view = v;
    
    return {
        
        getCmd: function() {
            return v.getUint8(0, true);
        },
        getId: function() {
            return v.getUint32(1, true);
        },
        getResultCode: function() {
            return v.getUint8(5, true);
        },
        getResultSize: function() {
            return v.getUint32(6, true);
        },
        getHeaderSize: function() {
            return sctp_header_size;
        },
        
        getResInt8: function(offset) {
            return view.getInt8(sctp_header_size + offset, true);
        },
        getResUint8: function(offset) {
            return view.getUint8(sctp_header_size + offset, true);
        },
        getResInt16: function(offset) {
            return view.getInt16(sctp_header_size + offset, true);
        },
        getResUint16: function(offset) {
            return view.getUint16(sctp_header_size + offset, true);
        },
        getResInt32: function(offset) {
            return view.getInt32(sctp_header_size + offset, true);
        },
        getResUint32: function(offset) {
            return view.getUint32(sctp_header_size + offset, true);
        },
        getResFloat32: function(offset) {
            return view.getFloat32(sctp_header_size + offset, true);
        },
        getResFloat64: function(offset) {
            return view.getFloat64(sctp_header_size + offset, true);
        },
        getResBuffer: function(offset, len) {
            return new Uint8Array(view.buffer, sctp_header_size + offset, len);
        },
        
    };
}

SctpClient = function() {
    this.socket = null;
    this.task_queue = [];
    this.task_timeout = 0;
    this.task_frequency = 10;
    this.events = {};
}

SctpClient.prototype.connect = function(url, success) {
    this.socket = new WebSocket('ws://' + window.location.host + '/sctp'/*, ['soap', 'xmpp']*/);
    this.socket.binaryType = 'arraybuffer';

    var self = this;
    this.socket.onopen = function() {
        console.log('Connected to websocket');
        success();
        
        var emit_events = function() {
            if (self.event_timeout != 0)
            {
                window.clearTimeout(self.event_timeout);
                self.event_timeout = 0;
            }
            
            self.event_emit();
            
            window.setTimeout(emit_events, 5000);
        };
        
        emit_events();
    };
    this.socket.onmessage = function(e) {
        console.log('message', e.data);
    };
    this.socket.onclose = function() {
        console.log('Closed websocket connection');
    };
    this.socket.onerror = function(e) {
        console.log('WebSocket Error ' + e);
    };
    
}


SctpClient.prototype._push_task = function(task) {
    this.task_queue.push(task);
    var self = this;
    
    function process() {
        var t = self.task_queue.shift();
        
        self.socket.onmessage = function(e) {
            
            var result = new SctpResultBuffer(new DataView(e.data));
            if (result.getResultSize() != e.data.byteLength - result.getHeaderSize())
                throw "Invalid data size " + l
            
            var r = result;
            var resCode = result.getResultCode();
            if (e && e.data && resCode == SctpResultCode.SCTP_RESULT_OK) {
                if (t.parse)
                    r = t.parse(result);
                if (t.resCode) 
                    resCode = t.resCode(result);
            }
            
            if (resCode == SctpResultCode.SCTP_RESULT_OK) {
                t.dfd.resolve(r);
            } else
                t.dfd.reject();
            
            if (self.task_queue.length > 0)
                self.task_timeout = window.setTimeout(process, this.task_frequency)
            else
            {
                window.clearTimeout(self.task_timeout);
                self.task_timeout = 0;
            }
        }

        self.socket.send(t.message);
    }
    
    if (!this.task_timeout && this.task_queue.length > 0) {
        this.task_timeout = window.setTimeout(process, this.task_frequency)
    }
};

SctpClient.prototype.new_request = function(message, parseFn, resCodeFn) {
    var dfd = new jQuery.Deferred();
    this._push_task({
        message: message,
        parse: parseFn,
        resCode: resCodeFn,
        dfd: dfd
    });
    return dfd.promise();
};

SctpClient.prototype.erase_element = function(addr) {
    var buffer = new SctpCommandBuffer(sc_addr_size);
    buffer.setHeader(SctpCommandType.SCTP_CMD_ERASE_ELEMENT, 0, 0);
    buffer.writeUint32(sc_addr_from_id(addr));
    
    return this.new_request(buffer.data, function(data) {
        return {
            resCode: data.getResultCode()
        };
    });
};


SctpClient.prototype.check_element = function(addr) {
    var buffer = new SctpCommandBuffer(sc_addr_size);
    buffer.setHeader(SctpCommandType.SCTP_CMD_CHECK_ELEMENT, 0, 0);
    buffer.writeUint32(sc_addr_from_id(addr));
    
    return this.new_request(buffer.data, function(data) {
        return {
            resCode: data.getResultCode()
        };
    });
};

SctpClient.prototype.get_element_type = function(addr) {
    var buffer = new SctpCommandBuffer(sc_addr_size);
    buffer.setHeader(SctpCommandType.SCTP_CMD_GET_ELEMENT_TYPE, 0, 0);
    buffer.writeUint32(sc_addr_from_id(addr));
    
    return this.new_request(buffer.data, function(data) {
        return {
            resCode: data.getResultCode(),
            result: data.getResUint16(0)
        };            
    });
};

SctpClient.prototype.get_arc = function(addr) {
    var buffer = new SctpCommandBuffer(sc_addr_size);
    buffer.setHeader(SctpCommandType.SCTP_CMD_GET_ARC, 0, 0);
    buffer.writeUint32(sc_addr_from_id(addr));
    
    return this.new_request(buffer.data, function(data) {
        return {
            resCode: data.getResultCode(),
            result: [sc_addr_to_id(data.getResUint32(0)), sc_addr_to_id(data.getResUint32(sc_addr_size))]
        };
    });
};

SctpClient.prototype.create_node = function(type) {
    var buffer = new SctpCommandBuffer(sc_type_size);
    buffer.setHeader(SctpCommandType.SCTP_CMD_CREATE_NODE, 0, 0);
    buffer.writeUint16(type);
    
    return this.new_request(buffer.data, function(data) {
        return {
            resCode: data.getResultCode(),
            result: sc_addr_to_id(data.getResUint32(0))
        };
    });
};


SctpClient.prototype.create_arc = function(type, src, trg) {
    var buffer = new SctpCommandBuffer(sc_type_size + 2 * sc_addr_size);
    buffer.setHeader(SctpCommandType.SCTP_CMD_CREATE_ARC, 0, 0);
    buffer.writeUint16(type);
    buffer.writeUint32(sc_addr_from_id(src));
    buffer.writeUint32(sc_addr_from_id(trg));
    
    return this.new_request(buffer.data, function(data) {
        return {
            resCode: data.getResultCode(),
            result: sc_addr_to_id(data.getResUint32(0))
        };
    });
};


SctpClient.prototype.create_link = function() {
    var buffer = new SctpCommandBuffer(0);
    buffer.setHeader(SctpCommandType.SCTP_CMD_CREATE_LINK, 0, 0);
    
    return this.new_request(buffer.data, function(data) {
        return {
            resCode: data.getResultCode(),
            result: sc_addr_to_id(data.getResUint32(0))
        };
    });
};


SctpClient.prototype.set_link_content = function(addr, data) {
    
    // determine type of content and it's size
    var dataBuff = null;
    if (typeof data === 'number') {
        size = 8;
        if (data % 1 === 0) {
            //! @todo: support of unsigned
            dataBuff = new ArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
            var view = new DataView(dataBuff);
            view.setInt32(0, data, true);
        } else {
            //! @todo: support unsigned
            dataBuff = new ArrayBuffer(Float64Array.BYTES_PER_ELEMENT);
            var view = new DataView(dataBuff);
            view.setFloat64(0, data, true);
        }
    } else if (typeof data === 'string' || data instanceof String) {
        dataBuff = String2ArrayBuffer(data);
    } else if (data instanceof ArrayBuffer) {
        dataBuff = data;
    } else
        throw "Unknown object type";
    
    var buffer = new SctpCommandBuffer(dataBuff.byteLength + sc_addr_size + Uint32Array.BYTES_PER_ELEMENT);
    buffer.setHeader(SctpCommandType.SCTP_CMD_SET_LINK_CONTENT, 0, 0);
    buffer.writeUint32(sc_addr_from_id(addr));
    buffer.writeUint32(dataBuff.byteLength);
    buffer.writeBuffer(dataBuff);
    
    return this.new_request(buffer.data, function(data) {
        return {
            resCode: data.getResultCode()
        };
    });    
};


SctpClient.prototype.get_link_content = function(addr, type) {
    var buffer = new SctpCommandBuffer(sc_addr_size);
    buffer.setHeader(SctpCommandType.SCTP_CMD_GET_LINK_CONTENT, 0, 0);
    buffer.writeUint32(sc_addr_from_id(addr));
    
    return this.new_request(buffer.data, function(data) {
        var n = data.getResultSize();
        
        var r = null;
        if (!type || type === 'string') {
            r = ArrayBuffer2String(data.getResBuffer(0));
        } else if (type === 'int') {
            if (data.getResultSize() !== Int32Array.BYTES_PER_ELEMENT)
                throw "Invalid size of content " + data.getResultSize();
            r = data.getResInt32(0);
        } else if (type === 'float') {
            if (data.getResultSize() !== Float64Array.BYTES_PER_ELEMENT)
                throw "Invalid size of content " + data.getResultSize();
            r = data.getResFloat64(0);
        } else
            throw "Unknown type " + type;
        
        return {
                resCode: data.getResultCode(),
                result: r
            };
    });
};


SctpClient.prototype.find_links_with_content = function(data) {
    throw "Not implemented";
};


SctpClient.prototype.iterate_elements = function(iterator_type, args) {
    var itCount = sc_iterator_type_count(iterator_type);
    
    if (args.length != itCount)
        throw "Invalid number of arguments";
    
    var paramsSize = sc_iteartor_params_size(iterator_type);
    var buffer = new SctpCommandBuffer(1 + paramsSize);
    buffer.setHeader(SctpCommandType.SCTP_CMD_ITERATE_ELEMENTS, 0, 0);
    buffer.writeUint8(iterator_type);
    
    switch (iterator_type)
    {
        case SctpIteratorType.SCTP_ITERATOR_3A_A_F:
            buffer.writeUint16(args[0]);
            buffer.writeUint16(args[1]);
            buffer.writeUint32(sc_addr_from_id(args[2]));
            break;
        case SctpIteratorType.SCTP_ITERATOR_3F_A_A:
            buffer.writeUint32(sc_addr_from_id(args[0]));
            buffer.writeUint16(args[1]);
            buffer.writeUint16(args[2]);
            break;
        case SctpIteratorType.SCTP_ITERATOR_3F_A_F:
            buffer.writeUint32(sc_addr_from_id(args[0]));
            buffer.writeUint16(args[1]);
            buffer.writeUint32(sc_addr_from_id(args[2]));
            break;
        case SctpIteratorType.SCTP_ITERATOR_5_A_A_F_A_A:
            buffer.writeUint16(args[0]);
            buffer.writeUint16(args[1]);
            buffer.writeUint32(sc_addr_from_id(args[2]));
            buffer.writeUint16(args[3]);
            buffer.writeUint16(args[4]);
            break;
        case SctpIteratorType.SCTP_ITERATOR_5_A_A_F_A_F:
            buffer.writeUint16(args[0]);
            buffer.writeUint16(args[1]);
            buffer.writeUint32(sc_addr_from_id(args[2]));
            buffer.writeUint16(args[3]);
            buffer.writeUint32(sc_addr_from_id(args[4]));
            break;
        case SctpIteratorType.SCTP_ITERATOR_5_F_A_A_A_A:
            buffer.writeUint32(sc_addr_from_id(args[0]));
            buffer.writeUint16(args[1]);
            buffer.writeUint16(args[2]);
            buffer.writeUint16(args[3]);
            buffer.writeUint16(args[4]);
            break;
        case SctpIteratorType.SCTP_ITERATOR_5_F_A_F_A_A:
            buffer.writeUint32(sc_addr_from_id(args[0]));
            buffer.writeUint16(args[1]);
            buffer.writeUint32(sc_addr_from_id(args[2]));
            buffer.writeUint16(args[3]);
            buffer.writeUint16(args[4]);
            break;
        case SctpIteratorType.SCTP_ITERATOR_5_F_A_F_A_F:
            buffer.writeUint32(sc_addr_from_id(args[0]));
            buffer.writeUint16(args[1]);
            buffer.writeUint32(sc_addr_from_id(args[2]));
            buffer.writeUint16(args[3]);
            buffer.writeUint32(sc_addr_from_id(args[4]));
            break;
        case SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F:
            buffer.writeUint32(sc_addr_from_id(args[0]));
            buffer.writeUint16(args[1]);
            buffer.writeUint16(args[2]);
            buffer.writeUint16(args[3]);
            buffer.writeUint32(sc_addr_from_id(args[4]));
            break;
    };
    
    return this.new_request(buffer.data, function(data) {
        var res = [];
        var n = data.getResUint32(0);
        for (var i = 0; i < n; ++i) {
            var idx = 4 + i * itCount * sc_addr_size;
            var r = [];
            for (var j = 0; j < itCount; ++j)
                r.push(sc_addr_to_id(data.getResUint32(idx + j * sc_addr_size)));
            res.push(r);
        }
        
        return {
            resCode: data.getResultCode(),
            result: res
        };
    }, function(data) {
        return data.getResUint32(0) > 0 ? SctpResultCode.SCTP_RESULT_OK : SctpResultCode.SCTP_RESULT_FAIL;
    });    
};


SctpClient.prototype.find_element_by_system_identifier = function(data) {
    var buffData = String2ArrayBuffer(data);
    var buffer = new SctpCommandBuffer(buffData.byteLength + 4);
    buffer.setHeader(SctpCommandType.SCTP_CMD_FIND_ELEMENT_BY_SYSITDF, 0, 0);
    buffer.writeUint32(buffData.byteLength);
    buffer.writeBuffer(buffData);
    
    return this.new_request(buffer.data, function(data) {
        return {
            resCode: data.getResultCode(),
            result: sc_addr_to_id(data.getResUint32(0))
        };
    });
};


SctpClient.prototype.set_system_identifier = function(addr, idtf) {
    throw "Not supported";
};

SctpClient.prototype.event_create = function(evt_type, addr, callback) {
    var dfd = new jQuery.Deferred();
    var self = this;
    
    var buffer = new SctpCommandBuffer(sc_addr_size + 1);
    buffer.setHeader(SctpCommandType.SCTP_CMD_EVENT_CREATE, 0, 0);
    buffer.writeUint8(evt_type);
    buffer.writeUint32(sc_addr_from_id(addr));
    
    this.new_request(buffer.data, function(data) {
        return {
            resCode: data.getResultCode(),
            result: data.getResUint32(0)
        };
    }).done(function(data) {
        self.events[data.result] = callback;
        dfd.resolve(data);
    }).fail(function(data) {
        dfd.reject(data);
    });
    
    return dfd.promise();
};

SctpClient.prototype.event_destroy = function(evt_id) {
    var dfd = new jQuery.Deferred();
    var self = this;
    
    var buffer = new SctpCommandBuffer(4);
    buffer.setHeader(SctpCommandType.SCTP_CMD_EVENT_DESTROY, 0, 0);
    buffer.writeUint32(evt_id);
    
    this.new_request(buffer.data, function(data) {
        return {
            resCode: data.getResultCode(),
            result: data.getResUint32(0)
        };
    }).done(function(data) {
        delete self.event_emit[evt_id];
        dfd.promise(data.result);
    }).fail(function(data){ 
        dfd.reject(data);
    });
    
    return dfd.promise();
};

SctpClient.prototype.event_emit = function() {
    var dfd = new jQuery.Deferred();
    var self = this;
    
    var buffer = new SctpCommandBuffer(0);
    buffer.setHeader(SctpCommandType.SCTP_CMD_EVENT_EMIT, 0, 0);
    
    this.new_request(buffer.data)
    .done(function (data) {
        var n = data.getResUint32(0);
        for (var i = 0; i < n; ++i) {
            evt_id = data.getResUint32(4 + i * 12);
            addr = sc_addr_to_id(data.getResUint32(8 + i * 12));
            arg = sc_addr_to_id(data.getResUint32(12 + i * 12));
            var func = self.events[evt_id];

            if (func)
                func(addr, arg);
        }
        dfd.resolve();
    }).fail(function(data) {
        dfd.reject();
    });;

    return dfd.promise();
};

SctpClient.prototype.get_statistics = function() {
    throw "Not implemented";
};

SctpClientCreate = function() {
    var dfd = jQuery.Deferred();
    
    var sctp_client = new SctpClient();
    sctp_client.connect('/sctp', function() {
        dfd.resolve(sctp_client);
    });
    
    return dfd.promise();
};