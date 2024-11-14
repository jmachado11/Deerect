/*
  Author: Martino Volcy
  Cite: N/A
*/

module ALU_8bit(input wire [7:0] a, input wire [7:0] b, input wire [2:0] op, output reg [7:0] out);
  always @(*) begin
    case(op)
      3'b000: out = a + b;              
         // add in your code to make the ALU works as shown
      3'b001: out = a - b;              // sub
      3'b010: out = a & b;              // and
      3'b011: out = a | b;              // or
      3'b100: out = a ^ b;              // xor
      3'b101: out = ~a;                 // not
      3'b110: out = a << b[2:0];        // shl
      3'b111: out = a >> b[2:0];        // shr
      default: out = 8'b0;
    endcase
  end
endmodule


/*
Test bench output

add op=000 out=00110010
sub op=001 out=11101000
and op=010 out=00000101
or  op=011 out=00101101
xor op=100 out=00101000
not op=101 out=11110010
shl op=110 out=10100000
shr op=111 out=00000000
add op=000 out=00101001
sub op=001 out=00000011
and op=010 out=00010010
or  op=011 out=00010111
xor op=100 out=00000101
not op=101 out=11101001
shl op=110 out=10110000
shr op=111 out=00000010

*/