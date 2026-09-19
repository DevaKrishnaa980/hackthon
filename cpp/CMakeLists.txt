cmake_minimum_required(VERSION 3.14)
project(ProjectAfterlifeMatchingEngine VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_library(afterlife_matching STATIC
    matching_engine.cpp
    matching_engine.hpp
)

target_include_directories(afterlife_matching PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

# Optional C++ command line test runner
add_executable(run_matching_test test_main.cpp)
target_link_libraries(run_matching_test PRIVATE afterlife_matching)
