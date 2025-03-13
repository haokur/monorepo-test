use libloading::{Library, Symbol};
use neon::prelude::*;
use std::env;
use std::fs;

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node"))
}

fn sum(mut cx: FunctionContext) -> JsResult<JsNumber> {
    let a = cx.argument::<JsNumber>(0)?.value(&mut cx) as i32;
    let b = cx.argument::<JsNumber>(1)?.value(&mut cx) as i32;

    let index_node_path = env::current_dir().expect("Failed to get current directory");
    let relative_lib_path = index_node_path
        .join("../../platform/macos/NativeLibrary/.build/release/libMySwiftLib.dylib");
    let absolute_lib_path = fs::canonicalize(&relative_lib_path)
        .expect("Failed to resolve absolute path for libMySwiftLib.dylib");
    println!(
        "index_node_path is {:?} ; relative_lib_path is{:?};lib_path_absolute is {:?}",
        index_node_path, relative_lib_path, absolute_lib_path
    );

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
    Ok(())
}
