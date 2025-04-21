mod utils;

use crate::utils::logger;
use libloading::{Library, Symbol};
use neon::prelude::*;
use std::env;
use std::fs;

fn log_message(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let logger_content = cx.argument::<JsString>(0)?.value(&mut cx) as String;
    logger::logger_execute(logger_content);
    Ok(cx.undefined())
}

fn get_clipboard_file_paths(mut cx: FunctionContext) -> JsResult<JsString> {
    let file_paths = utils::clipboard::get_clipboard_file_paths();
    let result = file_paths.join(",");
    Ok(cx.string(result))
}

fn get_dylib_absolute_path(dylib_name: &str) -> String {
    // 获取当前工作目录
    let current_dir = env::current_dir().expect("Failed to get current directory");

    // 构建基础路径：向上两级，然后进入目标目录
    let base_path = current_dir.join("../../platform/macos/NativeLibrary/.build/release");

    // 拼接完整的动态库文件名（自动添加.dylib后缀）
    let dylib_filename = format!("{}.dylib", dylib_name);
    let relative_lib_path = base_path.join(dylib_filename);

    // 转换为绝对路径
    let absolute_lib_path =
        fs::canonicalize(&relative_lib_path).expect("Failed to resolve absolute path");

    // 调试输出路径信息
    // println!(
    //     "Current dir: {:?}\nRelative path: {:?}\nAbsolute path: {:?}",
    //     current_dir, relative_lib_path, absolute_lib_path
    // );

    // 将PathBuf转换为String
    absolute_lib_path
        .to_str()
        .expect("Path contains invalid UTF-8 characters")
        .to_string()
}

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node"))
}

fn sum(mut cx: FunctionContext) -> JsResult<JsNumber> {
    let a = cx.argument::<JsNumber>(0)?.value(&mut cx) as i32;
    let b = cx.argument::<JsNumber>(1)?.value(&mut cx) as i32;

    let absolute_lib_path = get_dylib_absolute_path("libMySwiftLib");

    // 加载 `.dylib`
    let result = unsafe {
        let lib = Library::new(absolute_lib_path).expect("Failed to load Swift dynamic library");
        let sum_fn: Symbol<unsafe extern "C" fn(i32, i32) -> i32> =
            lib.get(b"add").expect("Failed to find function sum");

        sum_fn(a, b)
    };

    Ok(cx.number(result as f64))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("hello", hello)?;
    cx.export_function("sum", sum)?;
    cx.export_function("log_message", log_message)?;
    cx.export_function("get_clipboard_file_paths", get_clipboard_file_paths)?;
    Ok(())
}
