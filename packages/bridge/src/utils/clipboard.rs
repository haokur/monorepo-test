use cocoa::appkit::NSPasteboard;
use cocoa::base::{id, nil};
use cocoa::foundation::{NSArray, NSString};
use objc::rc::autoreleasepool;
use objc::runtime::Class;
use objc::{msg_send, sel, sel_impl};

#[test]
fn test_get_clipboard_files() {
    let file_paths = get_clipboard_file_paths();
    println!("{:?}", file_paths);
}

/// 获取剪切板内复制的文件列表
pub fn get_clipboard_file_paths() -> Vec<String> {
    let mut file_paths: Vec<String> = Vec::new();
    autoreleasepool(|| {
        unsafe {
            let pasteboard: id = NSPasteboard::generalPasteboard(nil);

            // 获取 NSURL 类，并强转成 id
            let nsurl_class = Class::get("NSURL").expect("无法找到 NSURL 类");
            let nsurl_class_id: id = nsurl_class as *const Class as id;

            // 创建 NSArray<NSURL>
            let classes: id = NSArray::arrayWithObject(nil, nsurl_class_id);

            // 调用 readObjectsForClasses:options:
            let items: id = msg_send![pasteboard, readObjectsForClasses: classes options: nil];

            if items != nil {
                let count: usize = msg_send![items, count];
                if count > 0 {
                    for i in 0..count {
                        let url_obj: id = msg_send![items, objectAtIndex: i];
                        let path: id = msg_send![url_obj, path];
                        let path_str = NSString::UTF8String(path);
                        let real_path = std::ffi::CStr::from_ptr(path_str)
                            .to_string_lossy()
                            .into_owned();
                        file_paths.push(real_path);
                    }
                }
            }
        }
    });

    file_paths
}
