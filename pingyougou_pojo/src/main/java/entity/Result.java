package entity;

/**
 * 返回结果封装
 */
public class Result {
    private boolean success;
    private String massage;

    public Result() {
    }

    public Result(boolean success, String massage) {
        this.success = success;
        this.massage = massage;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMassage() {
        return massage;
    }

    public void setMassage(String massage) {
        this.massage = massage;
    }
}
